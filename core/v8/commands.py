# -*- coding: utf-8 -*-

from django.conf import settings
from core.http import get_domain_with_protocol
from django.core.cache import cache
from django.conf import settings
from core.v8.factories import *
import json

from django.forms.formsets import formset_factory
import memcache
import urllib
import logging
import time

logger = logging.getLogger(__name__)

class EngineCommand(object):
    endpoint = 'defalt_endpoint'
    method = 'GET'
    logger = logging.getLogger(__name__)
    
    def __init__(self, query, app):

        # set defaults values
        self.app = app
        self.query = self._build_query(query)

        self.key_prefix = self._get_cache_key()

    def _build_query(self, query):

        # limpia los vacios
        new_query=[]
        for item in query:
            if item[1]:
                new_query.append(item)
        
        return new_query

    def _get_cache_key(self):
        params=str(hash(frozenset(sorted(self.query))))
        return ":".join([type(self).__name__, params]) 

    def _get_url(self):
        return get_domain_with_protocol(self.app, engine=True) + self.endpoint

    def _request(self, query):
        url = self._get_url()
        response = None

        try:
            params = urllib.urlencode(query)
            
            self.logger.info("URL: %s Params: %s query: %s method: %s" %(url, params, query, self.method))

        
            try:
                if self.method == 'GET':
                    response = urllib.urlopen(url + '?' + params)
                elif self.method == 'POST':
                    response = urllib.urlopen(url, params)
            except Exception, e:
                self.logger.error('Error trying to access to %s | %s (%s) ' % (url, str(params), str(e)))
                raise


            if response:
                if response.getcode() == 200:
                    ret = response.read()
                    if len(response.info().getplist()) > 0:
                        mimetype = '{0}; {1}'.format(response.info().gettype(), response.info().getplist()[0])
                    else:
                        mimetype = 'application; json'
                 
                    return ret, mimetype

            raise IOError('Error code %d at %s+%s' % (response.getcode(), url, str(params)))
        finally:
            if response:
                response.close()

    def run(self):
        result = cache.get(self.key_prefix)
        if result:
            return result

        try:
            answer = self._request(self.query)
            if answer:
                cache.set(self.key_prefix, answer, 60)
                return answer
            return '{"Error":"No invoke"}', "application/json; charset=UTF-8"
        except Exception, e:
            self.logger.debug(e)
            raise


class EngineInvokeCommand(EngineCommand):
    endpoint = settings.END_POINT_SERVLET

    def _build_query(self, query):
        answer = super(EngineInvokeCommand, self)._build_query(query)
        has_max_bytes = False
        for item in answer:
            # si alguno de estos 3 items tienen "true" lo transforma en "checked"
            if item[0] == 'pMaxBytes':
                has_max_bytes = True
                break

        if not has_max_bytes:
            answer.append(('pMaxBytes', settings.MAX_ENGINE_BYTES))
        return answer

class EngineChartCommand(EngineCommand):
    endpoint = settings.END_POINT_CHART_SERVLET

    def _build_query(self, query):
        answer = super(EngineChartCommand, self)._build_query(query)
        has_max_bytes = False
        for item in answer:
            # si alguno de estos 3 items tienen "true" lo transforma en "checked"
            if item[0] == 'pMaxBytes':
                has_max_bytes = True
                break

        if not has_max_bytes:
            answer.append(('pMaxBytes', settings.MAX_ENGINE_BYTES))
        return answer

class EnginePreviewChartCommand(EngineCommand):
    endpoint = settings.END_POINT_CHART_PREVIEWER_SERVLET

    def _build_query(self, query):
        new_query=[]
        for item in query:
            # si alguno de estos 3 items tienen "true" lo transforma en "checked"
            if item[0] in ('pInvertData','pInvertedAxis','pCorrelativeData') and item[1] == "true":
                new_query.append( (item[0], "checked") )
            # si alguno de estos 3 items tiene algo distinto que true, lo setea en ""
            elif item[0] in ('pInvertData','pInvertedAxis','pCorrelativeData'):
                new_query.append( (item[0], "") )
            elif item[0] == 'pPage' and item[1]:
                new_query.append( item)
            elif item[0] == 'pLimit' and item[1]:
                new_query.append(item)

            # param que si o si deben viajar, sean nulos o no
            elif item[0] in ( 'pNullValueAction', 'pNullValuePreset', 'pLabelSelection',
                              'pHeaderSelection', 'pTraceSelection', 'pLatitudSelection',
                              'pLongitudSelection'):
                new_query.append(item)

            # saliendo de los param que si o si deben viajar,
            # ahora nos fijamos los param que tengan un valor 
            elif item[1]:
                new_query.append(item)
                
        return new_query

class EngineLoadCommand(EngineCommand):
    endpoint = settings.END_POINT_LOADER_SERVLET

class EnginePreviewCommand(EngineCommand):
    endpoint = settings.END_POINT_PREVIEWER_SERVLET
    method = 'POST'

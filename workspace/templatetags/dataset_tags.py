# -*- coding: utf-8 -*-
from django import template
from django.utils.safestring import mark_safe
from django.utils import simplejson
from core.choices import *

register = template.Library()

@register.filter(name='status_str')
def status_str(status):
    return  unicode(STATUS_CHOICES[int(status)][1])

@register.filter(name='type_str')
def type_str(impl_type):
    return unicode(SOURCE_IMPLEMENTATION_CHOICES[int(impl_type)][1])

@register.filter(name='type_classname')
def type_classname(impl_type):
    return unicode(SOURCE_IMPLEMENTATION_CHOICES[int(impl_type)][1]).replace('/','-')

@register.filter
def jsonify(o):
    return mark_safe(simplejson.dumps(o))
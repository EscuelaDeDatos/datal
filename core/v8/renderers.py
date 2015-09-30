from rest_framework import renderers
from babel import numbers, dates
import json
import datetime
import sys
import re

class EngineRenderer(renderers.BaseRenderer):
    def render(self, data, media_type=None, renderer_context=None):
        return data

class CSVEngineRenderer(EngineRenderer):
    media_type="text/csv"
    format = "csv"

class XLSEngineRenderer(EngineRenderer):
    media_type="application/vnd.ms-excel"
    format = "xls"

class HTMLEngineRenderer(EngineRenderer):
    media_type="text/html"
    format = "html"

class GridEngineRenderer(EngineRenderer):
    media_type="application/json"
    format = "grid"

    def format_datetime(self, seconds, strformat="dd/mm/yyyy", strlocale="en_US"):
        try:
            # We need MILISECONDS but sometimes we receive seconds
            if seconds > 1000000000000: #ejemplos 1.399.488.910 | 1.399.047.696.818
                seconds = seconds/1000
            #REQUIRE sudo pip install babel
            myutc = datetime.datetime.utcfromtimestamp(seconds)
            #some patterns are differents from JS to python babel
            strformat = strformat.replace("DD", "EEEE").replace("D", "E").replace("yy", "Y")
            if strformat.find("MM") > -1:
                strformat = strformat.replace("MM", "MMMM")
            elif strformat.find("M") > -1:
                strformat = strformat.replace("M", "MMM")
            else:
                strformat = strformat.replace("m", "L")
            res = dates.format_datetime(myutc, format=strformat, locale=strlocale)
        except:
            #maybe TODO datetime.datetime.utcfromtimestamp(seconds/1000).strftime(strformat)
            err = str(sys.exc_info())
            res = str(seconds) + " error " + err

        return res


    def format_number_ms(self, number, strformat="#,###.##", strlocale="en_US", currency="USD"):
        """
        Apply the Locale Data Markup Language Specification: http://unicode.org/reports/tr35/tr35-numbers.html#Number_Format_Patterns
        Just Babel library do that on python: http://babel.pocoo.org/docs/numbers/ / https://github.com/mitsuhiko/babel
        """
        #REQUIRE sudo pip install babel
        #if not unicode(number).isnumeric():
        #    return number #False

        if number == "": # empty strings are BAD
            return 0
        if strformat == "":
            return number
        #maybe babe is not installed
        try:
            if (strformat.find("$") > -1 or strformat.find(u"\u00A4") > -1 or currency == ""):
                # strformat = unicode(strformat.replace("$", u"\u00A4"))
                res = numbers.format_currency(float(number), currency, format=strformat, locale=strlocale)
            else:
                res = numbers.format_decimal(float(number), format=strformat, locale=strlocale)
        except:
            err = str(sys.exc_info())
            res = str(number) + " error " + err

        return res

    def i18nize(self, l_cell, return_just_value = True):
        """
        apply the format requested. Cell is a common element from core.engine.invoke array
        Sometimes returns just the value of the cell o full cell
        """

        #On numbers and dates always check
        #l_cell['fLocale'] and l_cell['fPattern']
        has_display_format = False
        fPattern = None # "#,###.00"
        fLocale = None
        fCurrency = None

        if l_cell.get('fDisplayFormat', False):
            has_display_format = True
            if l_cell['fDisplayFormat'].get('fPattern',False):
                fPattern = l_cell['fDisplayFormat']['fPattern']
            if l_cell['fDisplayFormat'].get('fLocale',False):
                #sometimes locale come as en,us and it's wrong. We need en_US
                fLocale = l_cell['fDisplayFormat']['fLocale'].replace(",","_")
            if l_cell['fDisplayFormat'].get('fCurrency',False):
                fCurrency = l_cell['fDisplayFormat']['fCurrency']

        if l_cell.get('fStr', False) and unicode(l_cell['fStr']).isnumeric() and has_display_format:
            l_cell['fNum'] = l_cell['fStr']
            l_cell['fType'] = 'NUMBER'

        if l_cell['fType'] == 'NUMBER':
            dat = l_cell['fNum'] #.encode('utf-8', 'ignore')
            #dat = str(dat) + " // " + fPattern + " // " + fLocale + " // " + str(format_number_ms(fPattern, dat, fLocale))
            if has_display_format:
                dat = self.format_number_ms(dat, fPattern, fLocale, fCurrency)
            else:
                dat = self.format_number_ms(dat)
            ret = dat
        elif l_cell['fType'] == 'DATE':
            #transform seconds to real date in expected format
            if has_display_format:
                vdate = self.format_datetime(l_cell['fNum'], fPattern, fLocale)
            else:
                vdate = l_cell['fNum']
            ret = vdate

        elif l_cell['fType'] == 'LINK':
            cellval = l_cell['fStr'].encode('utf-8', 'ignore')
            cellval = "<a target='_blank' href='%s'>%s</a>" % (l_cell['fUri'].encode('utf-8', 'ignore'), cellval)
            ret = cellval

        else:
            cellval = l_cell['fStr'].encode('utf-8', 'ignore')
            cellval = re.sub(r'(<([^>]+)>)',' ', cellval) # in javascript was /(<([^>]+)>)/ig
            ret = cellval

        if not return_just_value:
            ret = l_cell
        return ret

    def render(self, data, media_type=None, renderer_context=None):
        l_lists = {}
        l_hasHeader = False
        l_noMoreHeaders = False

        try:
            p_response = data
        except:
            return '{"page": 1, "rows": [], "total":1}'

        l_lists["page"] = renderer_context['request'].REQUEST.get('page')
        l_lists["total"] = p_response['fLength']
        l_lists["rows"] = []

        if p_response['fType']=='ARRAY':
            l_i = 0
            l_row_i = 0
            for l_row_number in range(0, p_response['fRows']):
                l_row  = {}
                l_row["id"] = str(l_i)
                l_row["cell"] = []
                for l_column_number in range(0, p_response['fCols']):
                    l_cell = p_response['fArray'][l_i]

                    # TRANSFORM DE DATA
                    l_row["cell"].append(self.i18nize(l_cell))

                    if l_cell.has_key('fHeader') and l_noMoreHeaders == False:
                        l_hasHeader = True
                    l_i = l_i + 1

                l_row_i = l_row_i + 1

                if not l_hasHeader:
                    l_lists["rows"].append(l_row)
                else:
                    l_hasHeader = False
                    l_noMoreHeaders = True

        return json.dumps(l_lists)
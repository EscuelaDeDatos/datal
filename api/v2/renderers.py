from rest_framework import renderers
from django.template import loader, Context

class TablueRenderer(renderers.BaseRenderer):
    charset = 'utf-8'
    

class TableuHTMLRenderer(TablueRenderer):
    media_type="text/html"
    format = "html"

    def render(self, data, media_type=None, renderer_context=None):
        template = loader.get_template('tableau.html')
        return template.render(Context({'obj': data}))

class TableuJSRenderer(TablueRenderer):
    media_type="application/javascript"
    format = "js"

    def render(self, data, media_type=None, renderer_context=None):
        template = loader.get_template('tableau.js')
        return template.render(Context({'obj': data}))
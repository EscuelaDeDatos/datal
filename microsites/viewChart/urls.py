from django.conf.urls import *
from microsites.viewChart.views import *

urlpatterns = patterns('',
    url(r'^(?P<id>\d+)/(?P<slug>[A-Za-z0-9\-]+)?$', 'microsites.viewChart.views.view', name='chart_manager.view'),
    url(r'^embed/(?P<guid>[A-Z0-9\-]+)$', 'microsites.viewChart.views.embed', name='viewChart.embed'),
)

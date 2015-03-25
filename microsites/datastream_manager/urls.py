from django.conf.urls import *

urlpatterns = patterns('',
    url(r'^(?P<id>\d+)/(?P<slug>[A-Za-z0-9\-]+)/$', 'microsites.datastream_manager.views.action_view', name='datastream_manager.action_view'),
    url(r'^(?P<id>\d+)-(?P<slug>[A-Za-z0-9\-]+).download$', 'core.datastream_manager.views.action_download', name='datastream_manager.action_download'),
    url(r'^(?P<id>\d+)-(?P<slug>[A-Za-z0-9\-]+).csv$', 'core.datastream_manager.views.action_csv', name='datastream_manager.action_csv'),
    url(r'^(?P<id>\d+)-(?P<slug>[A-Za-z0-9\-]+).html$', 'core.datastream_manager.views.action_html', name='datastream_manager.action_html'),
    url(r'^(?P<id>\d+)-(?P<slug>[A-Za-z0-9\-]+).xls(?:$|x$)', 'core.datastream_manager.views.action_xls', name='datastream_manager.action_xls'),
    url(r'^(?P<id>\d+)/(?P<slug>[A-Za-z0-9\-]+)/flexmonster.xml$', 'microsites.datastream_manager.views.action_flexmonster', name='datastream_manager.action_flexmonster'),
    url(r'^updategrid$', 'core.datastream_manager.views.action_updategrid', name='datastream_manager.action_updategrid'),
    url(r'^get_last_30_days_datastream/(?P<id>\d+)$', 'core.datastream_manager.views.get_last_30_days_datastream', name='datastream_manager.get_last_30_days_datastream'),
    url(r'^category/(?P<category_slug>[A-Za-z0-9\-]+)/$', 'microsites.search.views.action_browse', name='search.action_browse'),
    url(r'^category/(?P<category_slug>[A-Za-z0-9\-]+)/page/(?P<page>\d+)/$', 'microsites.search.views.action_browse', name='search.action_browse'),
    url(r'^invoke$', 'core.datastream_manager.views.action_invoke'),
)

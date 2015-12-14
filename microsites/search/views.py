from django.core.paginator import InvalidPage, Paginator
from django.conf import settings
from django.http import Http404
from core.shortcuts import render_to_response
from core.models import Category
from microsites.search import forms
from microsites.managers import *
from microsites.exceptions import *
from core.exceptions import *
from microsites.exceptions import *

import logging


def action_browse(request, category_slug=None, page=1):
    logger = logging.getLogger(__name__)
    logger.error('action_browse')

def browse(request, category_slug=None, page=1):

    account = request.account
    preferences = request.preferences
    category = Category.objects.get_for_browse(category_slug, account.id, preferences['account_language'])

    accounts_ids =  [x['id'] for x in account.account_set.values('id').all()] + [account.id]

    try:
        results, search_time, facets = FinderManager().search(category_id=category['id'], account_id=[account.id]+accounts_ids)
    except InvalidPage:
        raise InvalidPage

    paginator = Paginator(results, settings.PAGINATION_RESULTS_PER_PAGE)
    page_results = paginator.page(page).object_list

    return render_to_response('search/search.html', locals())


def do_search(request, category_filters=None, datasets=None):

    account = request.account
    preferences = request.preferences
    form = forms.SearchForm(request.GET)

    if form.is_valid():
        query = form.get_query()
        page = form.cleaned_data.get('page')
        order = form.cleaned_data.get('order')

        accounts_ids =  [x['id'] for x in account.account_set.values('id').all()] + [account.id]

        try:
            resources = ["ds", "db", "vz", "dt"]
            results, search_time, facets = FinderManager().search(
                query=query, account_id=accounts_ids, category_filters=category_filters, order=order,
                resource=resources
            )
        except InvalidPage:
            raise InvalidPage


        paginator = Paginator(results, settings.PAGINATION_RESULTS_PER_PAGE)
        page_results = paginator.page(page).object_list

        return render_to_response('search/search.html', locals())
    else:
        raise Http404

def search(request):
    return do_search(request)


def search_by_query_and_category(request, category):
    try:
        datasets = request.GET.get("datasets", None)
        return do_search(request, category_filters=[category], datasets=datasets)
    except:
        return do_search(request)

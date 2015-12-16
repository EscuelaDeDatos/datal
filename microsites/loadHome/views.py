from django.core.paginator import Paginator
from django.http import HttpResponse, Http404
from django.views.decorators.http import require_POST, require_GET
from django.core.serializers.json import DjangoJSONEncoder
from django.template import loader, Context
from core.models import *
from core.managers import *
from core.shortcuts import render_to_response
from core.http import add_domains_to_permalinks
from microsites.loadHome.forms import QueryDatasetForm
from core.communitymanagers import *
from microsites.loadHome.managers import HomeFinder
from django.shortcuts import redirect
from django.utils.translation import ugettext
from core.exceptions import *
from microsites.exceptions import *
from core.search.finder import FinderQuerySet
from core.builders.themes import ThemeBuilder
import json
import logging

logger = logging.getLogger(__name__)


@require_GET
def load(request):
    """
    Shows the microsite's home page
    :param request:
    """
    jsonObject = None
    language = request.auth_manager.language
    account = request.account
    preferences = request.preferences
    is_preview = 'preview' in request.GET and request.GET['preview'] == 'true'
    
    builder = ThemeBuilder(preferences, is_preview, language, account)

    if is_preview or preferences["account_home"]:
        """ shows the home page new version"""
        data = builder.parse()

        if data:

            accounts_ids=data['federated_accounts_ids'] + [account.id]

            queryset = FinderQuerySet(FinderManager(HomeFinder), 
                max_results=250, account_id=accounts_ids )

            paginator = Paginator(queryset, 25)
            revisions = paginator.page(1)

            if data['federated_accounts_ids']:
                add_domains_to_permalinks(revisions.object_list)

            context = data.copy()
            context['has_federated_accounts'] = data['federated_accounts_ids'] != []
            context['request'] = request
            context['paginator'] = paginator
            context['revisions'] = revisions
            return render_to_response(data['template_path'], context)
        else:
            # For the moment, redirect to search
            return redirect('/search/')
    else:
        # For the moment, redirect to search, but this needs to be erased
        return redirect('/search/')


@require_POST
def update_list(request):
    account         = request.account
    auth_manager    = request.auth_manager
    preferences     = account.get_preferences()
    language        = request.auth_manager.language

    form = QueryDatasetForm(request.POST)
    if form.is_valid():
        query = form.cleaned_data.get('search')
        page = form.cleaned_data.get('page')
        order = form.cleaned_data.get('order')
        order_type = form.cleaned_data.get('order_type')

        resources = ['ds', 'db', 'vz', 'dt']
        category_filters = form.cleaned_data.get('category_filters')
        if category_filters:
            category_filters=category_filters.split(",")

        builder = ThemeBuilder(preferences, False, language, account)
        data = builder.parse()

        if data['federated_accounts_ids']:

            entity = form.cleaned_data.get('entity_filters')
            if entity:
                accounts_ids = [int(entity)]
            else:
                accounts_ids = data['federated_accounts_ids'] + [account.id]

            typef = form.cleaned_data.get('type_filters')
            if typef:
                resources = [typef]

            queryset = FinderQuerySet(FinderManager(HomeFinder), 
                query = query,
                max_results = 250,
                account_id = accounts_ids,
                resource = resources,
                category_filters=category_filters,
                order = order,
                order_type = order_type
            ) 

        else:
            all_resources = form.cleaned_data.get('all')
            if not all_resources:
                resources_type = form.cleaned_data.get('type')
                resources = []
                for resource_name in resources_type.split(','):
                    resources.append(resource_name)

            queryset = FinderQuerySet(FinderManager(HomeFinder), 
                category_filters= category_filters,
                query=query,
                resource=resources,
                max_results=250,
                order=order,
                order_type=order_type,
                account_id=account.id
            )

        paginator = Paginator(queryset, 25)

        revisions = paginator.page(page and page or 1)
        if data['federated_accounts_ids']:
            add_domains_to_permalinks(revisions.object_list)
        error = ''

        results = revisions.object_list
    else:
        error = 'Invalid data'
        results=[]
        categories=[]

    t = loader.get_template('loadHome/table.json')
    c = Context(locals())
    return HttpResponse(t.render(c), content_type="application/json")


@require_GET
def update_categories(request):
    language = request.auth_manager.language
    params = request.GET
    account_id = params.get('account_id','')

    # we need a full categories list in case is a "federated account" (have childs accounts)
    if account_id == '':
        account = request.account
        preferences = request.preferences
        builder = ThemeBuilder(preferences, False, language, account)
        data = builder.parse()

        if data['federated_accounts_ids']:
            federated_accounts=data['federated_accounts']
    
        categories = data['categories']
    else:
        # account_id is single account or a list of federated accounts
        categories = Category.objects.get_for_home(language, account_id)

    return render_to_response('loadHome/categories.js', locals(), mimetype="text/javascript")

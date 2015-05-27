# -*- coding: utf-8 -*-
import logging

from django import forms
from django.forms.formsets import formset_factory
from django.forms.util import ErrorDict
from django.utils.translation import ugettext_lazy

from core import choices
from core.models import CategoryI18n
from workspace.common.forms import TagForm, SourceForm


logger = logging.getLogger(__name__)


class RequestFileForm(forms.Form):
    dataset_revision_id = forms.IntegerField(required=True)


class DatasetForm(forms.Form):

    # Id
    id = forms.CharField(
        required=False,
        widget=forms.HiddenInput(attrs={
            'data-bind':'value:id'
        })
    )

    # Title
    title = forms.CharField(
        required=True,
        label=ugettext_lazy('APP-TITLE-TEXT'),
        max_length=80,
        widget=forms.TextInput(attrs={
            'data-bind':'value:title,events:[\'keyup\']',
            'tabindex':0,
            'autofocus':'autofocus'
        })
    )

    # Description
    description = forms.CharField(
        required=True,
        label=ugettext_lazy('APP-DESCRIPTION-TEXT'),
        max_length=140,
        widget=forms.TextInput(attrs={
            'data-bind':'value:description,events:[\'keyup\']',
            'tabindex':0
        })
    )

    # Category
    category = forms.ChoiceField(
        choices=[],
        required=True,
        label=ugettext_lazy('APP-CATEGORY-TEXT'),
        widget=forms.Select(attrs={
            'data-bind':'value:category,events:[\'keyup\']',
            'tabindex':0
        }),
    )

    # Status
    status = forms.ChoiceField(
        required=True,
        label=ugettext_lazy('APP-STATUS-TEXT'),
        choices=[],
        widget=forms.Select(attrs={
            'data-bind':'value:status,events:[\'keyup\']',
            'tabindex':0
        })
    )

    # Notes
    notes = forms.CharField(
        required=False,
        max_length=2048,
        label=ugettext_lazy('APP-NOTES-TEXT'),
        widget=forms.Textarea(attrs={
            'data-bind':'value:notes,events:[\'keyup\']',
            'tabindex':0
        })
    )

    # File Name
    file_name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'tabindex':-1,
            'class':'form-control',
            'readonly':'readonly'
        })
    )

    # End Point
    end_point = forms.CharField(
        required=False,
        label=ugettext_lazy('APP-ENDPOINT-TEXT'),
        widget=forms.URLInput(attrs={
            'data-bind':'value:end_point,events:[\'keyup\']',
            'autofocus':'autofocus'
        })
    )

    # Impl_Type
    impl_type = forms.ChoiceField(
        required=False,
        choices=[],
        label=ugettext_lazy('MODEL_IMPLEMENTATION_TYPE_LABEL'),
        widget=forms.Select(attrs={
            'data-bind':'value:impl_type,events:[\'keyup\']'
        })
    )

    # License_url
    license_url = forms.ChoiceField(
        required=False,
        choices=choices.ODATA_LICENSES,
        label=ugettext_lazy('APP-LICENSE-TEXT'),
        widget=forms.Select(attrs={
            'data-bind':'value:license_url,events:[\'keyup\']',
            'data-other':'#id_otherLicenseRow',
        })
    )

    #Spatial
    spatial = forms.CharField(
        required=False,
        label=ugettext_lazy('APP-REGION-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:spatial,events:[\'keyup\']',
            'tabindex':0
        })
    )

    # Frecuency
    frequency = forms.ChoiceField(
        required=False,
        choices=choices.ODATA_FREQUENCY,
        label=ugettext_lazy('APP-FREQUENCY-TEXT'),
        widget=forms.Select(attrs={
            'data-bind':'value:frequency,events:[\'keyup\']',
            'data-other':'#id_otherFrequencyRow',
            'tabindex':0
        })
    )

    # Mbox
    mbox = forms.CharField(
        required=False,
        max_length=90,
        label=ugettext_lazy('APP-CONTACT-EMAIL-TEXT'),
        widget=forms.EmailInput(attrs={
            'data-bind':'value:mbox,events:[\'keyup\']',
            'tabindex':0

        })
    )

    def __init__(self, data=None, *args, **kwargs):

        super(DatasetForm, self).__init__(data, *args)

        self.fields['status'].choices = kwargs.get('status_choices', choices.VALID_STATUS_CHOICES)
        self.fields['impl_type'].choices = kwargs.get('impl_type_choices', choices.SOURCE_IMPLEMENTATION_CHOICES)

        account_id = kwargs.get('account_id')
        language = kwargs.get('language')

        # Set Categories
        self.fields['category'].choices = [[category['category__id'], category['name']] for category in CategoryI18n.objects.filter(language=language, category__account=account_id).values('category__id', 'name')]
        if not self.initial and self.fields['category'].choices:
            self.initial = dict(category=self.fields['category'].choices[0][0])

        TagFormSet = formset_factory(TagForm)
        SourceFormSet = formset_factory(SourceForm)

        if not data:
            self.tag_formset = TagFormSet(prefix='tags')
            self.source_formset = SourceFormSet(prefix='sources')
        else:
            self.tag_formset = TagFormSet(data, prefix='tags')
            self.source_formset = SourceFormSet(data, prefix='sources')

    def is_valid(self):
        is_valid = super(DatasetForm, self).is_valid()
        is_valid = is_valid and self.tag_formset.is_valid()
        is_valid = is_valid and self.source_formset.is_valid()

        # Django does not allow to change form.errors, so we use form._errors
        if not is_valid:
            if self.tag_formset._errors or self.source_formset._errors:
                self._errors = dict(self._errors)

                for error in self.tag_formset._errors:
                    self._errors.update(dict(error))

                for error in self.source_formset._errors:
                    self._errors.update(dict(error))
                self._errors = ErrorDict(self._errors)
        else:
            self.cleaned_data['tags'] = [form.cleaned_data for form in self.tag_formset]
            self.cleaned_data['sources'] = [form.cleaned_data for form in self.source_formset]

        return is_valid


class WebserviceForm(DatasetForm):

    # Path to headers
    path_to_headers = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-PATHTOHEADERS-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:path_to_headers,events:[\'keyup\']'
        })
    )

    # Path to data
    path_to_data = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-PATHTODATA-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:path_to_data,events:[\'keyup\']'
        })
    )

    # Method Name
    method_name = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-METHODNAME-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:method_name,events:[\'keyup\']'
        })
    )

    # Name Space
    namespace = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-NAMESPACE-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:namespace,events:[\'keyup\']'
        })
    )

    # Token
    token = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-TOKEN-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:token,events:[\'keyup\']'
        })
    )

    # Algorithm
    algorithm = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-ALGORITHM-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:algorithm,events:[\'keyup\']'
        })
    )

    # Signature
    signature = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-SIGNATURE-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:signature,events:[\'keyup\']'
        })
    )

    # Use Cache
    use_cache = forms.BooleanField(
        required=False,
        label=ugettext_lazy('APP-CACHE-TEXT'),
        widget=forms.CheckboxInput(attrs={
            'data-bind':'checked:use_cache'
        })
    )

    # Username
    username = forms.CharField(
        required=False,
        label=ugettext_lazy('APP-USERNAME-TEXT'),
        widget=forms.TextInput(attrs={
            'data-bind':'value:username,events:[\'keyup\']'
        })
    )

    # Password
    password = forms.CharField(
        required=False,
        label=ugettext_lazy('APP-PASSWORD-TEXT'),
        widget=forms.PasswordInput(attrs={
            'data-bind':'value:password,events:[\'keyup\']'
        })
    )

    def __init__(self, data=None, *args, **kwargs):
        super(WebserviceForm, self).__init__(data, *args, **kwargs)

        WebserviceParamFormSet = formset_factory(WebserviceParamForm)

        self.param_formset = data is None and WebserviceParamFormSet(prefix='params') or WebserviceParamFormSet(data, prefix='params')

        self.fields['impl_type'].choices = kwargs.get('impl_type_choices', choices.WEBSERVICE_IMPLEMENTATION_CHOICES)

    def is_valid(self):

        is_valid = super(WebserviceForm, self).is_valid()
        is_valid = is_valid and self.param_formset.is_valid()

        if not is_valid:
            # Django does not allow to change form.errors, so we use form._errors
            if self.param_formset:
                if self.param_formset._errors:
                    self._errors = dict(self._errors)
                    for error in self.param_formset._errors:
                        self._errors.update(dict(error))
                    self._errors = ErrorDict(self._errors)
        self.cleaned_data['params'] = [form.cleaned_data for form in self.param_formset]

        return is_valid


class FileForm(DatasetForm):

    # file_data
    file_data = forms.FileField(
        required=False,
        label=ugettext_lazy('APP-FILE-TEXT'),
        widget=forms.FileInput(attrs={
            'data-bind':'value:file_data,events:[\'keyup\']',
            'tabindex':0,
            'data-other':'#id_file_name',
            'autofocus':'autofocus'
        })
    )


class DatasetFormFactory:

    def __init__(self, collect_type):
        self.collect_type = collect_type

    def create(self, request=None, *args, **kwargs):
        if int(self.collect_type) == choices.CollectTypeChoices().WEBSERVICE:
            form = WebserviceForm
        elif int(self.collect_type) == choices.CollectTypeChoices().SELF_PUBLISH:
            form = FileForm
        elif int(self.collect_type) == choices.CollectTypeChoices().URL:
            form = DatasetForm
        else:
            form = DatasetForm
        return request is None and form(*args, **kwargs) or form(request.POST, request.FILES, *args, **kwargs)


class WebserviceParamForm(forms.Form):

    # name
    name = forms.CharField(
        required=False,
        label=ugettext_lazy('APP-NAME-TEXT'),
        widget=forms.TextInput()
    )

    # default_value
    default_value = forms.CharField(
        required=False,
        label=ugettext_lazy('WORKSPACE-PARAM-DEFAULT'),
        widget=forms.TextInput()
    )

    # editable
    editable = forms.BooleanField(
        required=False,
        label=ugettext_lazy('WORKSPACE-PARAM-EDITABLE'),
        widget=forms.CheckboxInput()
    )


class LoadForm(forms.Form):
    dataset_revision_id = forms.IntegerField(required=True)
    page = forms.CharField(required=False)
    limit = forms.CharField(required=False)
    tableid = forms.CharField(required=False)


class MimeTypeForm(forms.Form):
    url = forms.CharField(required=True)

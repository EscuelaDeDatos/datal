# -*- coding: utf-8 -*-
from django import template
from core.choices import STATUS_CHOICES, SOURCE_IMPLEMENTATION_CHOICES

register = template.Library()

@register.filter(name='status_str')
def status_str(status):
    return STATUS_CHOICES[status]

@register.filter(name='type_str')
def type_str(impl_type):
    return unicode(SOURCE_IMPLEMENTATION_CHOICES[int(impl_type)][1])

@register.filter(name='type_classname')
def type_classname(impl_type):
    return unicode(SOURCE_IMPLEMENTATION_CHOICES[int(impl_type)][1]).replace('/','-')

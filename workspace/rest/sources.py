from core.models import Source
from rest_framework import serializers, viewsets

class SourceSerializer(serializers.ModelSerializer):

    def to_representation(self, obj):
        return obj.name

    class Meta:
        model = Source 
        fields = ('name',)

# ViewSets define the view behavior.
class RestSourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer

    def get_queryset(self):
        valid_accounts_ids = map(lambda x: x.id, self.request.user.account.get_parents())
        queryset = self.queryset.filter(account_id__in=valid_accounts_ids).distinct()
        term = self.request.query_params.get('term', None)
        if term :
            queryset = queryset.filter(name__icontains=term)
        url = self.request.query_params.get('url', None)
        if url:
            queryset = queryset.filter(url=url)
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name=name)
        return queryset
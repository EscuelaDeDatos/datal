from core.models import Tag
from rest_framework import serializers, viewsets

class TagSerializer(serializers.ModelSerializer):

    def to_representation(self, obj):
        return obj.name

    class Meta:
        model = Tag 
        fields = ('name',)

# ViewSets define the view behavior.
class RestTagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        queryset = self.queryset
        term = self.request.query_params.get('term', None)
        if term is not None:
            queryset = queryset.filter(name__icontains=term)
        return queryset
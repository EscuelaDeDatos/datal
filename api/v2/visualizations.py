from core.daos.visualizations import VisualizationDBDAO, VisualizationHitsDAO
from api.v2.serializers import ResourceSerializer
from core.rest.views import ResourceViewSet
from api.v2.mixins import RetriveHitsMixin


class VisualizationSerializer(ResourceSerializer):
    pass


class VisualizationViewSet(RetriveHitsMixin, ResourceViewSet):
    queryset = VisualizationDBDAO()
    serializer_class = VisualizationSerializer
    lookup_field = 'guid'
    dao_get_param = 'guid'
    data_types = ['vz']
    app = 'microsites'
    hits_dao = VisualizationHitsDAO
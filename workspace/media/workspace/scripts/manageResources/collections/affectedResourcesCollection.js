var AffectedResourcesCollection = Backbone.Collection.extend({
    model: affectedResourcesModel,
    url: 'retrieve_childs/'
});
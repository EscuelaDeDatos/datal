var TitleCellView = Backbone.View.extend({
    template: null,
    deleteListResources: null,
    events: {
        "click .delete": "deleteResource",
    },

    initialize: function(options) {
        this.parentModel = options.parentModel;
        this.itemCollection = options.itemCollection;
        this.template = _.template($("#grid-titlecell-template").html());
    },

    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    
    deleteResource: function() {
        this.deleteListResources = new Array();
        this.deleteListResources.push(this.model);
        var deleteItemView = new DeleteItemView({
            itemCollection: this.itemCollection,
            models: this.deleteListResources,
            parentModel: this.parentModel
        });
    },
});
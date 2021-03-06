var TypeCellView = Backbone.View.extend({
    
    template: null,

    initialize: function() {
        this.template = _.template($("#id_typeCellTemplate").html());
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});
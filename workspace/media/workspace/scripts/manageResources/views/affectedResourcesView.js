var affectedResourcesView = Backbone.View.extend({
    
    tagName: "li",

    initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
    },

    render: function() {
        this.$el.html(this.model.get('title'));
        this.$el.prepend('<span class=icon-' + this.model.get('type') + '></span>');
        return this;
    }

});
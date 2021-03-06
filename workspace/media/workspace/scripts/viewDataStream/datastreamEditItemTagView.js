var TagView = Backbone.View.extend({

  className: "tag",

  template: null,

  events: {
    'click .remove': 'removeTag'
  },

  initialize: function(){
    this.template = _.template( $("#id_TagTemplate").html() );
    this.render();
  },

  render: function(){
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  },

  removeTag: function(event){
    // Remove from DOM
    $(event.currentTarget).parents('.tag').remove();

    // Remove from colelction
    this.model.collection.remove( this.model.collection.get( this.model.cid ) );
  }

});
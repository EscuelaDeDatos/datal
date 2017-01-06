DeleteItemView = DeleteItemView.extend({

  initialize: function(options) {

      // Super parent init
      DeleteItemView.__super__.initialize.apply(this, arguments);

      this.successTitle = gettext('APP-DELETE-DATASTREAM-ACTION-TITLE');
      this.successText = gettext('APP-DELETE-DATASTREAM-ACTION-TEXT');
      this.errorTitle = gettext('APP-DELETE-ACTION-ERROR-TITLE');
      this.errorText = gettext('APP-DELETE-DATASTREAM-REV-ACTION-ERROR-TEXT');

  },

  deleteResource: function() {
		var affectedResourcesCollection = new AffectedResourcesCollection();
		var affectedResourcesCollectionView = new AffectedResourcesCollectionView({
			collection: affectedResourcesCollection,
			itemCollection: this.itemCollection,
			models: this.models,
			type: "visualizations",
      parentModel: this.parentModel,
		});
		this.closeOverlay();
		this.undelegateEvents();
	},

	afterSuccess: function(data){

    var self = this;

    this.itemCollection.fetch({
       reset: true,
       success: function(collection, response, options){ 
          if( collection.length == 0){
            self.parentModel.set('total_resources', 0);
            self.parentModel.set('total_entries', 0);
          }
        },
    });

  },

});

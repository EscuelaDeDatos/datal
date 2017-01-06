DeleteItemView = DeleteItemView.extend({

  initialize: function(options) {

      // Super parent init
      DeleteItemView.__super__.initialize.apply(this, arguments);

      this.successTitle = gettext('APP-DELETE-DATASET-ACTION-TITLE');
      this.successText = gettext('APP-DELETE-DATASET-REV-ACTION-TEXT') + ' ' + gettext('APP-DELETE-REDIRECT-TEXT');
      this.errorTitle = gettext('APP-DELETE-ACTION-ERROR-TITLE');
      this.errorText = gettext('APP-DELETE-DATASET-REV-ACTION-ERROR-TEXT');

  },

  deleteResource: function() {
		var affectedResourcesCollection = new AffectedResourcesCollection();
		affectedResourcesCollection.url = '/datasets/retrieve_childs/';

		var affectedResourcesCollectionView = new AffectedResourcesCollectionView({
			collection: affectedResourcesCollection,
			itemCollection: this.itemCollection,
			models: this.models,
			type: "datastreams"
		});
		this.closeOverlay();
		this.undelegateEvents();
	},
  
	afterSuccess: function(data){

		var deleteRevisionID = data['revision_id'],
      location = window.location.href,
      splitURL = location.split("/"),
      cutURL = splitURL.slice(0, -2),
      joinURL = cutURL.join("/");

    if(deleteRevisionID == -1){
      setURL = joinURL;
    }else{
      setURL = joinURL + "/" + deleteRevisionID;
    }

    setTimeout(function () {
      window.location = setURL;
    }, 2000);

	},

	// Over-ride original function
	closeOverlay: function() {
		this.$el.data('overlay').close();
	}

});

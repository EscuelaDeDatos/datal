DeleteItemView = DeleteItemView.extend({

  initialize: function(options) {

      // Super parent init
      DeleteItemView.__super__.initialize.apply(this, arguments);

      this.successTitle = gettext('APP-DELETE-VISUALIZATION-ACTION-TITLE');
      this.successText = gettext('APP-DELETE-VISUALIZATION-ACTION-TEXT');
      this.errorTitle = gettext('APP-DELETE-ACTION-ERROR-TITLE');
      this.errorText = gettext('APP-DELETE-VISUALIZATION-REV-ACTION-ERROR-TEXT');

  },

  deleteResource: function() {
		var self = this;
    _.each(this.models, function(model) {

      var resource = model.get('title');

      model.remove({

        success: function(response) {
          $.gritter.add({
            title: gettext('APP-DELETE-VISUALIZATION-ACTION-TITLE'),
            text:  resource + ": "+ gettext('APP-DELETE-VISUALIZATION-ACTION-TEXT'),
            image: '/static/workspace/images/common/ic_validationOk32.png',
            sticky: false,
            time: 3500
          });
          self.closeOverlay();
          self.undelegateEvents();
          self.afterSuccess();
        },

        error: function() {
          $.gritter.add({
            title: gettext('APP-DELETE-ACTION-ERROR-TITLE'),
            text: resource + ": "+  gettext('APP-DELETE-VISUALIZATION-ACTION-ERROR-TEXT'),
            image: '/static/workspace/images/common/ic_validationError32.png',
            sticky: true,
            time: 2500
          });
          self.closeOverlay();
          self.undelegateEvents();
        }
        
      });

    });
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

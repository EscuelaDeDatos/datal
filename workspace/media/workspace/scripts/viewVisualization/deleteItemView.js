DeleteItemView = DeleteItemView.extend({

  initialize: function(options) {

      // Super parent init
      DeleteItemView.__super__.initialize.apply(this, arguments);

      this.successTitle = gettext('APP-DELETE-VISUALIZATION-ACTION-TITLE');
      this.successText = gettext('APP-DELETE-VISUALIZATION-REV-ACTION-TEXT') + ' ' + gettext('APP-DELETE-REDIRECT-TEXT');
      this.errorTitle = gettext('APP-DELETE-ACTION-ERROR-TITLE');
      this.errorText = gettext('APP-DELETE-VISUALIZATION-REV-ACTION-ERROR-TEXT');

  },

  deleteResource: function() {
    var self = this;
    _.each(this.models, function(model) {
        resource = model.get('title');
        model.remove({

          success: function(response, data) {
              $.gritter.add({
                  title: gettext('APP-OVERLAY-DELETE-VISUALIZATION-CONFIRM-TITLE'),
                  text:  resource + ": "+ gettext('APP-DELETE-VISUALIZATION-ACTION-TEXT') + ' ' + gettext('APP-DELETE-REDIRECT-TEXT'),
                  image: '/static/workspace/images/common/ic_validationOk32.png',
                  sticky: false,
                  time: 3500
              });
              self.closeOverlay();
              self.undelegateEvents();
              self.afterSuccess(data);              
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

  // Over-ride original function
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

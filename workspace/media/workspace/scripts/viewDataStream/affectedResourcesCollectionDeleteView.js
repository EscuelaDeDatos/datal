AffectedResourcesCollectionView = AffectedResourcesCollectionView.extend({

    initialize: function(options) {

        // Super parent init
        AffectedResourcesCollectionView.__super__.initialize.apply(this, arguments);

        this.successTitle = gettext('APP-DELETE-DATASTREAM-ACTION-TITLE');
        this.successText = gettext('APP-DELETE-DATASTREAM-ACTION-TEXT') + ' ' + gettext('APP-DELETE-REDIRECT-TEXT');
        this.errorTitle = gettext('APP-DELETE-ACTION-ERROR-TITLE');
        this.errorText = gettext('APP-DELETE-DATASTREAM-ACTION-ERROR-TEXT');

    },

    initModel: function(){

        var self = this;

        // For each selected model, fetch related resources
        _.each(this.models, function(model, index) {

            self.collection.fetch({
                data: $.param({
                    revision_id: model.get('id'),
                    datastream_id: model.get('datastream_id'),
                    type: self.type
                }),
                success: function(response){
                    self.onFetchSuccess(model, index, response);
                },
            });

        });
        
    },

    afterSuccess: function(){
        var location = window.location.href,
            splitURL = location.split("/"),
            cutURL = splitURL.slice(0, -2),
            joinURL = cutURL.join("/");

        setTimeout(function () {
            window.location = joinURL;
        }, 2000);
    },

    // Over-ride original function
    closeOverlay: function() {
        this.$el.data('overlay').close();
    }

});
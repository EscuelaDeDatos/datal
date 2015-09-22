var AffectedResourcesCollectionView = Backbone.View.extend({

    el: '#id_confirmDeleteDataview',

    affectedResourcesHTML: '',

    events: {
        "click #id_deleteRelatedResources": "deleteRelatedResources",
        "click .close, .cancel": "closeOverlay",
    },

    initialize: function(options) {
        
        this.options = options;

        // init Overlay
        this.$el.overlay({
            top: 'center',
            left: 'center',
            mask: {
                color: '#000',
                loadSpeed: 200,
                opacity: 0.5,
                zIndex: 99999
            }
        });

        var total = this.options.models.length,
            self = this;

        // For each selected model, fetch related resources
        _.each(this.options.models, function(model, index) {

            console.log(model);

            self.collection.fetch({
                data: $.param({
                    revision_id: model.get('id'),
                    datastream_id: model.get('datastream_id'),
                    type: self.options.type
                }),
                success: function(model, response) {

                    if (self.collection.length > 0) {
                        _(self.collection.models).each(function(model) {
                            self.addResource(model);
                        }, self);
                    }

                    // If last model iterated, check if related resources in all model iterations, have been fetched and render, else delete resources without prompting an overlay
                    if (index === total - 1) {
                        if (self.affectedResourcesHTML) {
                            self.render();
                        } else {
                            self.deleteRelatedResources();
                        }
                    }

                }
            });


        });

        this.collection.bind('reset', this.render)

    },

    render: function() {
        this.$el.find('#id_affectedResourcesList').html( this.affectedResourcesHTML );

        var self = this;
        setTimeout(function(){
            self.$el.data('overlay').load();
        }, 250);
    },

    addResource: function(model) {
        // Add new affected resource to DOM
        var theView = new affectedResourcesView({
            model: model
        });
        this.affectedResourcesHTML += theView.render().el.outerHTML;
    },

    deleteRelatedResources: function() {
        var self = this;
        _.each(this.options.models, function(model) {
            resource = model.get('title')
            model.remove({

                success: function() {
                    $.gritter.add({
                        title: gettext('APP-OVERLAY-DELETE-DATASTREAM-CONFIRM-TITLE'),
                        text:  resource + ": "+ gettext('APP-DELETE-DATASTREAM-ACTION-TEXT'),
                        image: '/static/workspace/images/common/ic_validationOk32.png',
                        sticky: false,
                        time: 3500
                    });
                    self.closeOverlay();
                    self.undelegateEvents();
                    self.options.itemCollection.fetch({
                        reset: true
                    });
                },

                error: function() {
                    $.gritter.add({
                        title: gettext('APP-OVERLAY-DELETE-DATASET-CONFIRM-TITLE'),
                        text: resource + ": "+  gettext('APP-DELETE-DATASET-ACTION-ERROR-TEXT'),
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

    closeOverlay: function() {
        $("#ajax_loading_overlay").hide();
        this.$el.data('overlay').close();
    }

});
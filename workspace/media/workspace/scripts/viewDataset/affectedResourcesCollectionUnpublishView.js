var AffectedResourcesCollectionUnpublishView = Backbone.View.extend({

    el: '#id_confirmUnpublishDataset',

    affectedResourcesHTML: '',

    parentView: null,

    events: {
        "click #id_unpublishRelatedResources": "unpublishRelatedResources",
        "click .close, .cancel": "closeOverlay",
    },

    initialize: function(options) {

        this.parentView = options.parentView;
        this.models = options.models;
        this.type = options.type;

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

        // Parent View
        this.parentView = this.parentView;

        var total = this.models.length,
            self = this;

        // For each selected model, fetch related resources
        _.each(this.models, function(model, index) {

            self.collection.fetch({
                data: $.param({
                    revision_id: model.get('id'),
                    dataset_id: model.get('dataset_id'),
                    type: self.type
                }),
                success: function(model, response) {
                    
                    if (self.collection.length > 0) {
                        _(self.collection.models).each(function(model) {
                            self.addResource(model);
                        }, self);
                    }

                    // If last model iterated, check if related resources in all model iterations, have been fetched and render, else unpublish resources without prompting an overlay
                    if (index === total - 1) {
                        if (self.affectedResourcesHTML) {
                            self.render();
                        } else {
                            // We simulate click in order to pass event object to change_status function
                            self.$el.find('#id_unpublishRelatedResources').click();
                        }
                    }

                }
            });


        });

        this.collection.bind('reset', this.render);
        
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

    unpublishRelatedResources: function(event) {
        this.parentView.changeStatus(event, true);

        this.closeOverlay();
        this.undelegateEvents();
    },

    closeOverlay: function() {
        //$("#ajax_loading_overlay").hide();
        this.$el.data('overlay').close();
    }

});
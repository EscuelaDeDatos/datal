var AffectedResourcesCollectionView = function(options) {
    this.inheritedEvents = [];

    Backbone.View.call(this, options);
}

_.extend(AffectedResourcesCollectionView.prototype, Backbone.View.prototype, {
        
    // Extend functions

    baseEvents: {

        // Add AffectedResourcesCollectionView events as Base Events
        "click .close, .cancel": "closeOverlay",
        "click #id_deleteRelatedResources": "deleteRelatedResources",
        
    },

    events: function() {
        var e = _.extend({}, this.baseEvents);

        _.each(this.inheritedEvents, function(events) {
            e = _.extend(e, events);
        });

        return e;
    },

    addEvents: function(eventObj) {
        this.inheritedEvents.push(eventObj);
        this.delegateEvents();
    },

    // AffectedResourcesCollectionView functions

    el: '#id_confirmDeleteOverlay',

    affectedResourcesHTML: '',
    
    // Init generic messages ( TODO: crear keys genericas para colocar aca en vez de '' )
    successTitle: '',
    successText: '',
    errorTitle: '',
    errorText: '',

    initialize: function(options) {

        this.models = options.models;
        this.type = options.type;
        this.itemCollection = options.itemCollection;

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

        // Init model
        this.initModel();

        this.collection.bind('reset', this.render)

    },

    render: function() {
        this.$el.find('#id_affectedResourcesList').html( this.affectedResourcesHTML );

        var self = this;
        setTimeout(function(){
            self.$el.data('overlay').load();
        }, 250);
    },

    onFetchSuccess: function(model, index, response) {

        if (this.collection.length > 0) {
            _(this.collection.models).each(function(model) {
                this.addResource(model);
            }, this);
        }

        // If last model iterated, check if related resources in all model iterations, have been fetched and render, else delete resources without prompting an overlay
        if (index === this.models.length - 1) {
            if (this.affectedResourcesHTML) {
                this.render();
            } else {
                this.deleteRelatedResources();
            }
        }

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
        _.each(this.models, function(model) {
            resource = model.get('title')
            model.remove({

                success: function(response, data) {
                    $.gritter.add({
                        title: self.successTitle,
                        text:  resource + ": "+ self.successText,
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
                        title: self.errorTitle,
                        text: resource + ": "+ self.errorText,
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

    afterSuccess: function(){
        this.itemCollection.fetch({
            reset: true
        });
    },

    closeOverlay: function() {
        $("#ajax_loading_overlay").hide();
        this.$el.data('overlay').close();
    }


});

AffectedResourcesCollectionView.extend = Backbone.View.extend;
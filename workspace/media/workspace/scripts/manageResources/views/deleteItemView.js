var DeleteItemView = function(options) {
  this.inheritedEvents = [];

  Backbone.View.call(this, options);
}

_.extend(DeleteItemView.prototype, Backbone.View.prototype, {
        
  // Extend functions

  baseEvents: {

    // Add DeleteItemView events as Base Events
    "click #id_deleteResource": "deleteResource",
		"click #id_deleteRevision": "deleteRevision"
      
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

  // DeleteItemView functions

  el: '#id_deleteOverlay',

  // Init generic messages ( TODO: crear keys genericas para colocar aca en vez de '' )
  successTitle: '',
  successText: '',
  errorTitle: '',
  errorText: '',

	initialize: function(options) {

		this.parentModel = options.parentModel;
		this.itemCollection = options.itemCollection;
		this.models = options.models;

    this.cant = this.models[0].attributes.cant;

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
		
		// Render
		this.render();

	},

	render: function(){

	  // oculta el boton de eliminar revisión actual
	  if ( this.cant > 1 ){
      $("#id_deleteRevision",this.$el).show();
    }else{
      $("#id_deleteRevision",this.$el).hide();
      $("#id_deleteResource").addClass('delete').removeClass('red').attr('title', gettext('APP-OVERLAY-DELETE')).html(gettext('APP-OVERLAY-DELETE'));
    }

		this.$el.data('overlay').load();
	},

	deleteRevision: function() {
		self = this;
		_.each(this.models, function(model) {

			var resource = model.get('title');

			model.remove_revision({

				success: function(response, data) {
					$.gritter.add({
						title: self.successTitle,
						text: resource + ": " + self.successText,
						//text: resource + ": " + data.messages[0],
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
						text: resource + ": " + self.errorText,
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

DeleteItemView.extend = Backbone.View.extend;

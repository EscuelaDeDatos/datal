var UnpublishView = Backbone.View.extend({
	
	el: '#id_unpublishVisualization',

	parentView: null,
	
	events: {
		"click #id_unpublishResource": "unpublishVisualization",
		"click #id_unpublishRevision": "unpublishRevision"
	},

	initialize: function(options) {

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

    this.parentView = options.parentView;

		// Render
		this.render();

	},

	render: function(){
		this.$el.data('overlay').load();
	},

	unpublishVisualization: function(event) {
		
		this.parentView.changeStatus(event, true);

		this.closeOverlay();
		this.undelegateEvents();

	},

	unpublishRevision: function(event){

		this.parentView.changeStatus(event, false);

		this.closeOverlay();
		this.undelegateEvents();

	}, 

	closeOverlay: function() {
		//$("#ajax_loading_overlay").hide();
		this.$el.data('overlay').close();
	}

});
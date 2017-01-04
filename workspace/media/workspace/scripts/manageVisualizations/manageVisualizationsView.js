ManageResourcesView = ManageResourcesView.extend({

	initialize: function(options) {

		// Super parent init
		ManageResourcesView.__super__.initialize.apply(this, arguments);

		// Right way to extend events without overriding the parent ones
		var eventsObject = {}
		eventsObject['click #id_addNewButton'] = 'onAddNewButtonClicked';
		this.addEvents(eventsObject);

	},

	onAddNewButtonClicked: function() {
		var manageDatastreamsOverlayView = new ManageDatastreamsOverlayView();
	},

});
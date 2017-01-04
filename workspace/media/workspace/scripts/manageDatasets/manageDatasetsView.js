ManageResourcesView = ManageResourcesView.extend({

	datastreamImplValidChoices: null,

	initialize: function(options) {

		// Super parent init
		ManageResourcesView.__super__.initialize.apply(this, arguments);

		this.datastreamImplValidChoices = options.datastreamImplValidChoices;

	},

});
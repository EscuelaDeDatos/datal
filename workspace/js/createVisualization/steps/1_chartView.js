var ChartView = StepViewSPA.extend({
	
	initialize: function(){

		// Right way to extend events without overriding the parent ones
		var eventsObject = {}
		eventsObject['click a.backButton'] = 'onPreviousButtonClicked';
		eventsObject['click a.nextButton'] = 'onNextButtonClicked';
		eventsObject['click button.selectData'] = 'onSelectDataClicked';
		eventsObject['click button.chartType'] = 'onChartTypeClicked';
		eventsObject['change select#chartLibrary'] = 'onChartLibraryChanged';
		this.addEvents(eventsObject);

		// Bind model validation to view
		//Backbone.Validation.bind(this);

		this.render();

	}, 

	render: function(){

		var self = this;
		
		return this;
	},

	onSelectDataClicked: function(){
		this.openModal('chartSelectDataModal');
	},

	onChartTypeClicked: function(e){
		e.preventDefault();
		var type = $(e.target).data('type');
		this.selectGraphType(type);
	},

	onChartLibraryChanged: function(e){
		var lib = $(e.target).val();
		this.model.set('lib',lib);
		this.chartChanged();
	},

	selectGraphType: function(type){
		$('.chartType').removeClass('active');
		$('.chartType.'+type).addClass('active');
		this.model.set('type',type);
		this.chartChanged();
	},

	chartChanged: function(){
		this.cleanChart();
		this.createChart();
	},

	cleanChart: function(){
		//mejorar
		$('#chartContainer').html('');
	},

	createChart: function(){
		this.chartSettings = this.factoryChart();

		this.chartRender();

		//chart factory from model?
		$('#chartContainer').html(this.model.get('type') + ' - '+ this.model.get('lib') );

	},

	availableCharts: {
		'd3':{
			'line': {
						'Class': charts.views.C3LineChart
					},
			'bars': {
						'Class': charts.views.C3BarChart
					},
		},
		'google':{
			'line': {
						'Class': charts.views.GoogleLineChart
					},
			'bars': {
						'Class': charts.views.GoogleBarChart
					}
		}
	},

	factoryChart: function(){
		if(_.has(this.availableCharts,this.model.get('lib')) &&
			_.has(this.availableCharts[this.model.get('lib')],this.model.get('type')) ){
			return this.availableCharts[this.model.get('lib')][this.model.get('type')];
		} else {
			return false;
		}

	},

	chartRender: function(){

		if(this.chartSettings){
			var model = new Backbone.Model();
			this.chartInstance = new this.chartSettings.Class({
				model: model
			});
		} else {
			console.log('There are not class for this');
		}

	},

	onPreviousButtonClicked: function(){
		this.previous();
	},

	onNextButtonClicked: function(){		

		/*if(this.model.isValid(true)){
			this.model.setOutput();*/
			this.next();
		/*}*/

	},

	start: function(){
		this.constructor.__super__.start.apply(this);

		// default google
		this.model.set('lib','google');

		// chart type from first step
		var initial = this.model.get('type');
		initial = (initial)?initial:'line';
		this.selectGraphType(initial);

	},



});
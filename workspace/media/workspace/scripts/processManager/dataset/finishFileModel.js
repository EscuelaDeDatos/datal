var FinishFileModel = FinishModel.extend({

	setDataFromOutput: function(){

		var output = this.get('output'),
			data = this.get('data');

		data.mbox = output.mbox;
		data.doc = output.doc;
		data.spatial = output.spatial;
		data.license_url = output.license_url;
		data.frequency = output.frequency;
		data.collect_type = output.collect_type;
		data.impl_type = output.impl_type;

		this.set('data',data);
		

	}

});
var CollectWebserviceModel = StepModel.extend({

	defaults:{
		end_point: "",
		impl_type: 14,
		impl_details: "",
		path_to_headers: "",
		path_to_data: "",
		token: "",
		algorithm: "",
		username: "",
		password: "",
		signature: "",
		method_name: "",
		namespace: "",
		use_cache: "",
		params: [],
		mbox: "",
		license_url: "",
		license_url_other: null,
		spatial: "",
		frequency: 'ondemand',
		frequency_other: null,
		collect_type: 2
	},

	validation: {
		end_point: [
			{
				required: true,
				msg: gettext('VALIDATE-REQUIREDFIELD-TEXT')
			},{
				pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
				msg: gettext('VALIDATE-URLNOTVALID-TEXT')
			}
		],
		mbox: [
			{
				required: false
			},{
				pattern: 'email',
				msg: gettext('VALIDATE-EMAILNOTVALID-TEXT')
			}
		],
		license_url: function(value, attr, computedState){
			if(value === 'other' && $.trim(computedState.license_url_other) === '' ) {
				return gettext('VALIDATE-REQUIREDFIELD-TEXT');
			}
		},
		license_url_other: [
			{
				required: false
			},{
				pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
				msg: gettext('VALIDATE-URLNOTVALID-TEXT')
			}
		],
		frequency: function(value, attr, computedState){
			if(value === 'other' && $.trim(computedState.frequency_other) === '' ) {
				return gettext('VALIDATE-REQUIREDFIELD-TEXT');
			}
		}
	},

	setOutput: function(){

		var output = this.get('output');
		
		output.mbox = $.trim( this.get('mbox') );
		output.end_point = $.trim( this.get('end_point') );
		output.impl_type = $.trim( this.get('impl_type') );
		output.path_to_headers = $.trim( this.get('path_to_headers') );
		output.path_to_data = $.trim( this.get('path_to_data') );
		output.token = $.trim( this.get('token') );
		output.algorithm = $.trim( this.get('algorithm') );
		output.username = $.trim( this.get('username') );
		output.password = this.get('password');
		output.signature = $.trim( this.get('signature') );
		output.method_name = $.trim( this.get('method_name') );
		output.namespace = $.trim( this.get('namespace') );
		output.use_cache = $.trim( this.get('use_cache') );
		output.spatial = $.trim( this.get('spatial') );
		output.license_url = $.trim( this.get('license_url') );
		output.frequency = $.trim( this.get('frequency') );
		output.collect_type = this.get('collect_type');
		output.params = this.get('params');

		// Check if license is "other"
		if( output.license_url == 'other' ){
			output.license_url = $.trim( this.get('license_url_other') );
		}

		// Check if frequency is "other"
		if( output.frequency == 'other' ){
			output.frequency = $.trim( this.get('frequency_other') );
		}

		// Set new output
		this.set('output',output);

	},

	parseImplDetails: function(){

		var impl_details = this.get('impl_details');
			$impl_details = $(_.unescape( this.get('impl_details') ) ),
			$parsedXML = $($.parseXML( _.unescape( this.get('impl_details') ) ) ),
			use_cache = false,
			signature = '';	
		
		if($impl_details.attr('useCache') == "True") {
			use_cache = true;
		}
		this.set('use_cache', use_cache);
				
		if( this.get('impl_type') == 1 ){
			this.set('method_name', $impl_details.find('methodName').text());
			this.set('namespace', $impl_details.find('targetNamespace').text());
		}else if( this.get('impl_type') == 14 ){
			this.set('path_to_headers', $impl_details.find('pathToHeaders').text());
			this.set('path_to_data', $impl_details.find('pathToData').text());
			this.set('token', $impl_details.find('token').text());
			this.set('algorithm', $impl_details.find('algorithm').text());
			this.set('username', $impl_details.find('userName').text());
			this.set('password', $impl_details.find('password').text());
			if( $parsedXML.find('uriSignatures > *').length > 0 ) {
				signature = $parsedXML.find('uriSignatures > *').get(0).nodeName;
				if(signature == 'sign_name'){
					signature = '';
				}
			}
			this.set('signature', signature);
		}

		// Params
		var $args = $parsedXML.find('args > *'),
			params = [];

		$args.each(function(){
			
			var name = this.nodeName,
				element = $(this),
				default_value = element.text(),
				editable = false;

			if(typeof element.attr('editable') != "undefined" && element.attr('editable') != "false"){
				editable = true;
			}

			params.push({
				name: name,
				default_value: default_value,
				editable: editable
			});

		});

		this.set('params',params);

	}

});
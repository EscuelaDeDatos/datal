var AddSourceModel = Backbone.Model.extend({

	defaults: {
		name: "",
		url: ""
	},

	validation: {
		name: [
			{
				required: true,
				msg: gettext('VALIDATE-REQUIREDFIELD-TEXT')
			},{
				maxLength: 40,
				msg: gettext('VALIDATE-MAXLENGTH-TEXT-1') + ' 40 ' + gettext('VALIDATE-MAXLENGTH-TEXT-2')
			}
		],
		url: [
			{
				required: true,
				msg: gettext('VALIDATE-REQUIREDFIELD-TEXT')
			},{
				pattern: /^(?:(ht|f|sf)tp(s?)\:\/\/)/,
				msg: gettext('VALIDATE-PROTOCOLNOTALLOWED-TEXT')
			},{
				pattern: 'url',
				msg: gettext('VALIDATE-URLNOTVALID-TEXT')
			}
		]
	},

	validateSourceNameAlreadyExist: function() {
		var url = '/source_manager/validate_source_name/',
			data = {},
			msg = false;
		data['name'] = this.get('name');
		$.ajax({
			url: url,
			type: 'GET',
			data: data,
			dataType: 'json',
			async: false,
			success: function(response){
				if( response.name != false){
					msg = gettext( 'VALIDATE-SOURCENAMEALREADYEXIST-TEXT' );	
				}
			}
		});
		return msg;
	},

	validateSourceUrlAlreadyExist: function() {
		var url = '/source_manager/validate_source_url/',
			data = {},
			msg = false;
		data['url'] = this.get('url');
		$.ajax({
			url: url,
			type: 'GET',
			data: data,
			dataType: 'json',
			async: false,
			success: function(response){
				if( response.name != false){
					msg =  gettext( 'VALIDATE-SOURCEALREADYEXIST-TEXT1' ) + response.name + gettext( 'VALIDATE-SOURCEALREADYEXIST-TEXT2' );	
				}
			}
		});
		return msg;
	}

});

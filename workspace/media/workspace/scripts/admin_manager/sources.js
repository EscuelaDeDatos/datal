$(document).ready(function(){

    // OVERLAY
    $formContainer = $('#id_sourceFormContainer');
    $formContainer.overlay({ top: 'center', left: 'center', mask: {color: '#000', loadSpeed: 200, opacity: 0.5, zIndex: 99999}, closeOnClick: false, closeOnEsc: true, load: false});

    $form = $('#id_sourceForm');

    // EDIT
    $('#id_sourcesTable .edit a').click(function(event){
        event.preventDefault();
        var $tr = $(this).parents('tr');
        var id = $tr.attr('data-id');
        var name = $tr.find('span.name').html();
        var url = $tr.attr('data-url');
        $form.find('#id_id').val(id);
        $form.find('#id_name').val(name);
        $form.find('#id_url').val(url);
        $form.attr('action', '/admin/edit_source/');
        $formContainer.data('overlay').load();
    });

    // CREATE
    $('#id_create_source').click(function(event){
        event.preventDefault();
        $form.find('#id_id').val('');
        $form.find('#id_name').val('');
        $form.find('#id_url').val('');
        $form.attr('action', '/admin/create_source/');
        $formContainer.data('overlay').load();
    });

    // FORM VALIDATION
    $form.validate({
        rules: {
            name: { required: true, maxlength: 128},
            url: { required: true, maxlength: 1024}
        },
        submitHandler: function(form){
            $form = $(form);
            $('#id_imLoader').fadeIn();
            $form.find('input[type=submit]').attr('disabled', 'disabled');
            $.ajax({
                url: $form.attr('action'),
                data: $form.serialize(),
                type: $form.attr('method'),
                success: function(response){

                    var messages = response.messages;
                        status = response.status,
                        title = gettext('APP-SETTINGS-SAVE-OK-TITLE'),
                        imageURL = '/static/workspace/images/common/ic_validationOk32.png';

                    if( _.isArray(messages) ){
                        messages = messages.join('. ');
                    }

                    if(status == 'error'){
                        title = 'Error';
                        imageURL = '/static/workspace/images/common/ic_validationError32.png';
                    }

                    // Notification
                    $.gritter.add({
                        title: title,
                        text: messages,
                        image: imageURL,
                        sticky: true
                    });

                    if(status == 'ok'){
                        $('#gritter-notice-wrapper').css({'z-index': 100000001});
                        $('#ajax_loading_overlay').show();
                        setTimeout(function(){
                            window.location.reload(true);
                        }, 2000);
                    }

                },
                error: function(response){
                    var response = JSON.parse(response.responseText),
                        messages = response.messages;

                    if( _.isArray(messages) ){
                        messages = messages.join('. ');
                    }

                    // Notification
                    $.gritter.add({
                        title: 'Error',
                        text: messages,
                        image: '/static/workspace/images/common/ic_validationError32.png',
                        sticky: true,
                        time: 2500
                    });
                },
                complete: function(){
                    $('#id_imLoader').fadeOut();
                    $form.find('input[type=submit]').removeAttr('disabled');
                    $formContainer.data('overlay').close();
                }
            });
            return false;
        }
    });


    $('#id_sourcesTable .delete a').click(function(event){
        event.preventDefault();
        var $tr = $(this).parents('tr');
        var id = $tr.attr('data-id');

        if(confirm(gettext('SOURCE-DELETE-CONFIRMATION'))) {
            $('#ajax_loading_overlay').show();
            $.ajax({
                url: '/admin/delete_source/',
                data: {'id': id, 'csrfmiddlewaretoken': $form.find('[name=csrfmiddlewaretoken]').val()},
                type: 'POST',
                success: function(response) {

                    console.log(response);

                    var messages = response.messages;

                    if( _.isArray(messages) ){
                        messages = messages.join('. ');
                    }

                    $.gritter.add({
                        title:gettext("APP-SETTINGS-SAVE-OK-TITLE"),
                        image: '/static/workspace/images/common/ic_validationOk32.png',
                        text: messages,
                        sticky: false,
                        time: 3500
                    });

                    var $tr = $("tr[data-id=" + response.source_id + "]");

                    if ($tr) {
                        $tr.remove();
                    }

                },
                error: function(response) {

                    error = response.responseText;

                    if (error.indexOf("IntegrityError") > -1){
                        error = "source is empty?";
                    }

                    $.gritter.add({
                        title:'Error',
                        sticky: true,
                        image: '/static/workspace/images/common/ic_validationError32.png',
                        text: error,
                        time: 2500
                    });
                }, 
                complete: function(){
                    $('#ajax_loading_overlay').hide();
                }
            });
        }
    });

});

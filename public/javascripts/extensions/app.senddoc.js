app.senddoc = {
    SendDocController: function ( options ) {
        var _this = this;

        this.id = app.utils.makeId(16);

        this.options = {
            message_template: 'Здравствуйте, во вложении счет №{{doc_num}} от компании {{cc_type_name}} &laquo;{{cc_name}}&raquo;',
            doc_num: '1',
            email: 'test@test.test',
            title: 'Отправить счет по почте',
            doc_id: ''
        };

        $.extend( this.options, options );

        $.ajax({
            url: '/auth/user',
            type: 'POST',
            dataType: 'json',
            beforeSend: function(){
                app.loading.setGlobalLoading('senddoc');
            },
            success: function(data){
                app.loading.unSetGlobalLoading('senddoc');

                if(data.success === true){
                    var message = app.templates.renderFromVar(_this.options.message_template, {
                        doc_num: _this.options.doc_num,
                        cc_type_name: app.utils.getCompanyTypeName(data.data.cc_type),
                        cc_name: data.data.cc_name
                    });

                    app.templates.render('email.item.html', { email: _this.options.email, description: message }, function(html){
                        var modal_controller = new app.modal.ModalController({
                            title: _this.options.title,
                            content: html,
                            onShow: function(controller){
                                var form_controller = new app.form.FormController({
                                    form_selector: '#form-email-item',
                                    from_modal: true,
                                    modal_controller: modal_controller,
                                    url: '/accounts/send/' + _this.options.doc_id,
                                    fields: {
                                        email: '#ie_email',
                                        message: '#ie_message'
                                    },
                                    messages: {
                                        OK: 'Счет отправлен клиенту',
                                        EMAIL_EMPTY: 'Не введен e-mail',
                                        EMAIL_WRONG: 'Не корректно введен e-mail'
                                    },
                                    onSuccess: function(data){
                                        setTimeout(function(){
                                            controller.close();
                                        }, 1000);
                                    }
                                });
                            },
                            onClose: function(){

                            },
                            width: 550,
                            draggable: true
                        });

                        modal_controller.open();
                    });
                }
            },
            error: function(){
                app.loading.unSetGlobalLoading('senddoc');
            }
        });
    }
};
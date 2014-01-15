app.form = {
    messages: {
        SERVER_ERROR                        : 'Ошибка сервера',

        INVALID_CREDENTIALS                 : 'Неправильные данные',

        EMAIL_EMPTY                         : 'E-mail обязателен',
        EMAIL_DOES_NOT_MATCH_PATTERN        : 'E-mail неверный',
        EMAIL_USED                          : 'E-mail уже используется',

        USERNAME_EMPTY                      : 'Имя пользователя обязателено',
        USERNAME_DOES_NOT_MATCH_PATTERN     : 'Имя &mdash; только латинские символы, цифры и дефисы',
        USERNAME_USED                       : 'Имя пользователя уже используется',

        PASSWORD_EMPTY                      : 'Пароль обязателен',
        PASSWORD_DOES_NOT_MATCH_PATTERN     : 'Пароль &mdash; только латинские символы, цифры и дефисы',

        DATE_EMPTY                          : 'Не введена дата',
        DATE_DOES_NOT_MATCH_PATTERN         : 'Неправильная дата'
    },

    FormController: function(options){
        var _this = this;

        this.options = {
            setFieldError: function($field){
                $field.addClass('input-error');
            },
            unSetFieldError: function($field){
                $field.removeClass('input-error');
            },
            beforeSend: function(){},
            onSuccess: function(data){},
            onFail: function(){},

            from_modal: false,
            modal_controller: null,
            fields: {},
            url: '',
            form_selector: '',
            message_animation_time: 200,
            messages: {}
        };

        $.extend(this.options, options);

        this.$form = $(this.options.form_selector);

        if(this.$form.length <= 0){
            return;
        }

        this.$form.find('.form-message').hide();

        this.clearErrorsBinder = function(fields){
            $.each(fields, function(key, val){
                $(val).off('focus.ce change.ce keyup.ce').on('focus.ce change.ce keyup.ce', function(){
                    _this.options.unSetFieldError($(this));
                });
            });
        };

        this.clearErrorsBinder(this.options.fields);

        this.setFieldsErrors = function(fields){
            if(fields){
                for (var i = 0, l = fields.length; i < l; i++) {
                    this.options.setFieldError($('#' + fields[i]));
                }
            }
        };

        this.unSetFieldsErrors = function(){
            $.each(this.options.fields, function(key, val){
                _this.options.unSetFieldError($(val));
            });
        };

        this.parseServerMessage = function(message_code){
            var messages = {};

            $.extend(messages, app.form.messages, this.options.messages);

            if(messages[message_code]){
                return messages[message_code];
            } else {
                return message_code;
            }
        };

        this.setLoading = function(){
            if(this.options.from_modal === true && this.options.modal_controller){
                this.options.modal_controller.setLoading();
            }else{
                app.loading.setGlobalLoading('app.form.FormController.' + this.options.form_selector);
            }
        };

        this.unSetLoading = function(){
            if(this.options.from_modal === true && this.options.modal_controller){
                this.options.modal_controller.unSetLoading();
            }else{
                app.loading.unSetGlobalLoading('app.form.FormController.' + this.options.form_selector);
            }
        };

        this.processForm = function(){
            var data = {};

            for (var key in _this.options.fields) {
                if (_this.options.fields.hasOwnProperty(key)) {
                    data[key] = _this.$form.find(_this.options.fields[key]).val();
                }
            }

            $.ajax({
                url: _this.options.url,
                type: 'post',
                data: data,
                dataType: 'json',
                beforeSend: function(){
                    _this.$form.find('input[type="submit"]')
                        .attr('disabled', 'disabled')
                        .prop('disabled', true);

                    _this.unSetFieldsErrors();
                    _this.setLoading();

                    if(_this.$form.find('.form-message').is(':visible')){
                        _this.$form.find('.form-message').slideUp(_this.options.message_animation_time, function(){
                            _this.$form.find('.form-message').empty();
                        });
                    }

                    _this.options.beforeSend();
                },
                success: function (data) {
                    setTimeout(function(){
                        _this.unSetLoading();

                        if(data && data.success === true){
                            app.templates.render('form.message.html', { message: _this.parseServerMessage(data.message) }, function(html){
                                _this.$form.find('.form-message')
                                    .html(html)
                                    .slideDown(_this.options.message_animation_time);

                                _this.options.onSuccess(data);

                                _this.$form.find('input[type="submit"]')
                                    .removeAttr('disabled', 'disabled')
                                    .removeProp('disabled');
                            }, function(){ _this.setLoading(); }, function(){ _this.unSetLoading(); });
                        }else{
                            app.templates.render('form.message.html', { message: _this.parseServerMessage(data.message) }, function(html){
                                _this.$form.find('.form-message')
                                    .html(html)
                                    .slideDown(_this.options.message_animation_time);

                                if(data.fields){
                                    _this.setFieldsErrors(data.fields);
                                }

                                if(_this.options.onFail) {
                                    _this.options.onFail();
                                }

                                _this.$form.find('input[type="submit"]')
                                    .removeAttr('disabled', 'disabled')
                                    .removeProp('disabled');
                            }, function(){ _this.setLoading(); }, function(){ _this.unSetLoading(); });
                        }

                    }, _this.options.message_animation_time * 1.5);
                },
                error: function(){
                    setTimeout(function(){
                        _this.unSetLoading();

                        app.templates.render('form.message.html', { success: false, message: _this.parseServerMessage('SERVER_ERROR') }, function(html){
                            _this.$form.find('.form-message')
                                .html(html)
                                .slideDown(_this.options.message_animation_time);

                            _this.$form.find('.form-message').html(html);

                            _this.$form.find('input[type="submit"]')
                                .removeAttr('disabled', 'disabled')
                                .removeProp('disabled');
                        }, function(){ _this.setLoading(); }, function(){ _this.unSetLoading(); });
                    }, _this.options.message_animation_time * 1.5);
                }
            });
        };

        this.$form.off('submit').on('submit', function(e){
            e.preventDefault();
            _this.processForm();
        });
    }
}
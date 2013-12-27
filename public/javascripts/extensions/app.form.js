app.FormController = function(options){
    this.options = options;
    this.$form = $(this.options.form_selector);

    this.message_animation_time = 200;

    if(this.$form.length <= 0){
        return;
    }

    //this.$form.find('.form-message').hide();

    var _this = this;

    this.$form.off('submit').on('submit', function(e){
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
                app.loading.setGlobalLoading('app.FormController.' + _this.options.form_selector);

                if(_this.$form.find('.form-message').is(':visible')){
                    _this.$form.find('.form-message').slideUp(_this.message_animation_time, function(){
                        _this.$form.find('.form-message').empty();
                    });
                }

                if(_this.options.beforeSend) {
                    _this.options.beforeSend();
                }
            },
            success: function (data) {
                setTimeout(function(){
                    app.loading.unSetGlobalLoading('app.FormController.' + _this.options.form_selector);

                    if(data && data.success === true){
                        app.templates.render('form.message.html', data, function(html){
                            _this.$form.find('.form-message')
                                .html(html)
                                .slideDown(_this.message_animation_time);

                            if(_this.options.onSuccess) {
                                _this.options.onSuccess(data);
                            }
                        });
                    }else{
                        app.templates.render('form.message.html', data, function(html){
                            _this.$form.find('.form-message')
                                .html(html)
                                .slideDown(_this.message_animation_time);

                            if(_this.options.onFail) {
                                _this.options.onFail();
                            }
                        });
                    }

                }, _this.message_animation_time * 1.5);
            },
            error: function(){
                setTimeout(function(){
                    app.loading.unSetGlobalLoading('app.FormController.' + _this.options.form_selector);

                    app.templates.render('form.message.html', {success: false, message: 'Server error'}, function(html){
                        _this.$form.find('.form-message')
                            .html(html)
                            .slideDown(_this.message_animation_time);

                        _this.$form.find('.form-message').html(html);
                    });
                }, _this.message_animation_time * 1.5);
            }
        });

        e.preventDefault();
    });
}
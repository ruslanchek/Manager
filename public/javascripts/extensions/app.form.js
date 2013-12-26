app.FormController = function(options){
    this.options = options;
    this.$form = $(this.options.form_selector);

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
                if(_this.options.beforeSend) {
                    _this.options.beforeSend();
                }
            },
            success: function (data) {
                if(data && data.success === true){
                    app.templates.render('login.message.html', {message: _this.options.success_message}, function(html){
                        _this.$form.find('.form-message').html(html);

                        if(_this.options.onSuccess) {
                            _this.options.onSuccess(data);
                        }
                    });
                }else{
                    app.templates.render('login.message.html', {message: _this.options.fail_message}, function(html){
                        _this.$form.find('.form-message').html(html);

                        if(_this.options.onFail) {
                            _this.options.onFail();
                        }
                    });
                }
            },
            error: function(){
                app.templates.render('login.message.html', {message: 'Sorry, server error. Try again.'}, function(html){
                    _this.$form.find('.form-message').html(html);
                });
            }
        });

        e.preventDefault();
    });
}
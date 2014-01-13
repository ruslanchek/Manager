app.modal = {
    ModalController: function(options){
        this.$modal = null;

        this.options = {
            title: 'Title',
            content: 'Content',
            onShow: function($modal){

            },
            onClose: function(){

            },
            width: 600,
            animation_time: 400
        };

        $.extend(this.options, options);

        var _this = this;

        this.position = function(){
            this.$modal.css({
                width: this.options.width,
                marginLeft: -this.options.width / 2
            });
        };

        this.generateHtml = function(){
            app.templates.render('modal.window.html', { title: this.title, content: this.content }, function(html){
                _this.$modal = $(html);

                $('body').append(_this.$modal);
                _this.position();

                _this.$modal.addClass('ready');
                _this.options.onShow(_this.$modal);
            });
        };

        this.open = function(){
            this.generateHtml();
        };

        this.close = function(){
            if(this.$modal !== null){
                this.$modal.removeClass('ready');

                setTimeout(function(){
                    _this.$modal.remove();
                    _this.$modal = null;
                    _this.options.onClose();
                }, this.options.animation_time);
            }
        };

        this.setLoading = function(){

        };

        this.unSetLoading = function(){

        };
    }
}
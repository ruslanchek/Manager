app.notify = {
    NotifyController: function(options){
        this.showed = false;

        this.options = {
            icon: '',
            content: '',
            classname: 'yellow',
            onShow: function(){

            },
            onClose: function(){

            },
            onClick: function($notice){

            }
        };

        $.extend(this.options, options);

        var _this = this;

        this.show = function(){
            this.close(function(){
                var template = '<a href="#" class="notice animation-300-easeInOutQuart {{classname}}"><i class="{{icon_classname}}"></i><span>{{content}}</span></a>';

                var html = app.templates.renderFromVar(template, {
                    classname: _this.options.classname,
                    icon_classname: _this.options.icon,
                    content: _this.options.content
                });

                $('.app').prepend(html);

                $('.notice').off('click').on('click', function(){
                    _this.options.onClick($(this));
                });

                setTimeout(function(){
                    $('.notice').css({
                        marginTop: 0
                    });
                }, 100);

                setTimeout(function(){
                    _this.options.onShow();
                }, 400);

                _this.showed = true;
            });
        };

        this.close = function(done){
            if(this.showed === true){
                $('.notice').css({
                    marginTop: -40
                });

                setTimeout(function(){
                    $('.notice').remove();
                    _this.showed = false;
                    _this.options.onClose();

                    if(done){
                        done();
                    }
                }, 400);
            }else{
                this.showed = false;

                if(done){
                    done();
                }
            }
        };
    }
}
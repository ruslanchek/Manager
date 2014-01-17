app.docview = {
    DocviewController: function(options){
        var _this = this;

        this.opened = false;
        this.$docview = null;

        this.options = {
            title: 'Title',
            content: 'Content',
            onShow: function(controller){

            },
            onClose: function(){

            }
        };

        $.extend(this.options, options);

        this.open = function(){
            $('.app, footer').hide();
            $('.wrap').append(
                '<div class="docview">' +
                    '<div class="tools-bar">' +
                        '<div class="tools-bar-content">' +
                            '<h1>' + this.options.title + '</h1>' +
                            '<div class="tools">' +
                                '<a href="#" class="action-button"><i class="icon-print"></i> Напечатать</a>' +
                                '<a href="#" class="action-button warning close-docview" title="Закрыть просмотр (Esc)"><i class="icon-cancel"></i> Закрыть</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="content">' + this.options.content + '</div>' +
                '</div>'
            );

            this.$docview = $('.docview');
            this.options.onShow(this);

            this.$docview.find('.close-docview').on('click', function(e){
                e.preventDefault();
                _this.close();
            });

            $('body').on('keyup.docview', function(e){
                if(e.keyCode == 27){
                    _this.close();
                }
            });

            $('body, html').animate({
                scrollTop: 0
            }, 200);
        };

        this.close = function(){
            $('.docview').remove();
            $('.app, footer').show();

            $('body, html').animate({
                scrollTop: 0
            }, 200);
        }
    }
}
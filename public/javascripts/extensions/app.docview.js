app.docview = {
    DocviewController: function(options){
        var _this = this;

        this.opened = false;
        this.$docview = null;

        this.options = {
            title: 'Title',
            url: '',
            post: {},
            tools: true,
            toolbar: true,
            type: 'iframe',
            content: '',
            onShow: function(controller){

            },
            onClose: function(){

            },
            onReady: function(){

            }
        };

        $.extend(this.options, options);

        this.open = function(){


            var tools = '',
                toolbar = '';

            if(this.options.tools == true){
                tools = '<a href="#" class="action-button action-download"><i class="icon-doc-inv"></i> Скачать PDF</a>' +
                        '<a href="#" class="action-button action-print"><i class="icon-print"></i> Напечатать</a>' +
                        '<a href="#" class="action-button action-send"><i class="icon-export-alt"></i> Отправить</a>';
            }

            if(this.options.toolbar == true){
                toolbar =   '<div class="tools-bar">' +
                                '<div class="tools-bar-content">' +
                                    '<h1>' + this.options.title + '</h1>' +
                                    '<div class="tools">' +
                                        tools +
                                        '<a href="#" class="action-button action-delete warning close-docview" title="Закрыть просмотр (Esc)"><i class="icon-cancel"></i> Закрыть</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
            }

            $('.app, footer').hide();


            $('.wrap').append(
                '<div class="docview">' +
                    toolbar +
                    '<div class="content"></div>' +
                '</div>'
            );

            this.$docview = $('.docview');

            if(this.options.type == 'iframe'){
                app.loading.setGlobalLoading('docview.iframe_content');

                this.$docview.find('.content').html('<iframe name="docview_iframe"></iframe>');

                $('iframe[name="docview_iframe"]').on('ready', function(){
                    app.loading.unSetGlobalLoading('docview.iframe_content');

                    setTimeout(function(){
                        _this.options.onReady();
                    }, 600);
                });

                if(this.options.post){
                    var fields = '';

                    $.each(this.options.post, function(key, val){
                        fields += '<input type="hidden" name="' + key + '" value="' + val + '">';
                    });

                    this.$docview.append('<form action="' + this.options.url + '" class="docview-form" method="post" target="docview_iframe">' + fields + '</form>');
                    this.$docview.find('.docview-form').submit();
                    this.$docview.find('.close-docview').on('click', function(e){
                        e.preventDefault();
                        _this.close();
                    });
                }
            }else{
                this.$docview.find('.content').html(this.options.content);
            }

            this.options.onShow(this);

            this.resize = function(){
                $('.docview .content').css({
                    height: $('body').height() - 64
                });
            };

            $(window).off('resize.docview').on('resize.docview', function(){
                _this.resize();
            });

            this.resize();

            /*$('body').on('keyup.docview', function(e){
                if(e.keyCode == 27){
                    _this.close();
                }
            });*/

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

            $(window).off('resize.docview');
        }
    }
}
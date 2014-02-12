app.docview = {
    DocviewController: function(options){
        var _this = this;

        this.opened = false;
        this.$docview = null;

        this.options = {
            title: 'Title',
            url: '',
            method: 'post',
            data: {},
            tools: true,
            toolbar: true,
            content: '',
            onShow: function(controller){

            },
            onClose: function(){

            },
            onReady: function(controller){

            },
            onDownload: function(){

            },
            onPrint: function(){

            },
            onSend: function(){

            }
        };

        $.extend(this.options, options);

        this.printIframeContent = function(){
            this.$iframe.get(0).contentWindow.print();
        };

        this.open = function(){
            var tools = '',
                toolbar = '';

            var print_html = '<a href="#" class="action-button" id="docview-print"><i class="icon-print"></i> Напечатать</a>',
                send_html = '<a href="#" class="action-button" id="docview-send"><i class="icon-export-alt"></i> Отправить</a>',
                download_html = '<a href="#" class="action-button" id="docview-download"><i class="icon-doc-inv"></i> Скачать PDF</a>';

            if(this.options.tools || this.options.tools === true){
                if($.isArray(this.options.tools)){
                    for(var i = 0, l = this.options.tools.length; i < l; i++){
                        if(this.options.tools == 'download'){
                            tools += download_html;
                        }

                        if(this.options.tools == 'print'){
                            tools += print_html;
                        }

                        if(this.options.tools == 'send'){
                            tools += send_html;
                        }
                    }
                } else {
                    if(this.options.tools == 'download' || this.options.tools === true) {
                        tools += download_html;
                    }

                    if(this.options.tools == 'print' || this.options.tools === true) {
                        tools += print_html;
                    }

                    if(this.options.tools == 'send' || this.options.tools === true) {
                        tools += send_html;
                    }
                }
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

            $('#docview-download').on('click', function(){
                _this.options.onDownload();
            });

            $('#docview-print').on('click', function(){
                _this.printIframeContent();
            });

            $('#docview-send').on('click', function(){
                _this.options.onSend();
            });

            this.$docview = $('.docview');

            this.$docview.find('.action-button .action-print')

            app.loading.setGlobalLoading('docview.iframe_content');

            this.$docview.find('.content').html('<iframe name="docview_iframe"></iframe>');

            var fields = '';

            $.each(this.options.data, function(key, val){
                fields += '<input type="hidden" name="' + key + '" value="' + val + '">';
            });

            var method = 'post';

            if(this.options.method == 'get'){
                method = 'get';
            }

            this.$docview.append('<form action="' + this.options.url + '" class="docview-form" method="' + method + '" target="docview_iframe">' + fields + '</form>');

            this.$docview.find('.docview-form').submit();

            this.$docview.find('.close-docview').on('click', function(e){
                e.preventDefault();
                _this.close();
            });

            this.options.onShow(this);

            this.$iframe = this.$docview.find('iframe[name="docview_iframe"]');

            this.$iframe.on('ready', function(){
                app.loading.unSetGlobalLoading('docview.iframe_content');

                if(_this.options.content){
                    var $iframe_contents = _this.$iframe.contents();

                    $iframe_contents.find('.blank-print').append(_this.options.content);
                }

                setTimeout(function(){
                    _this.options.onReady(_this);
                }, 600);
            });

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
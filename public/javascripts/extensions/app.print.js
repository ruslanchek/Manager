app.print = {
    PrintListController: function(options){
        var _this = this;

        this.options = {
            table_selector: '.items-table',
            ids: [],
            tools: ['print']
        };

        this.print_type = '';

        $.extend(this.options, options);

        this.doDocByDocPrint = function(){
            this.printDocByDoc({
                onGatherComplete: function(){
                    if(_this.modal_controller){
                        _this.modal_controller.close();
                    }
                }
            });
        };

        this.doListPrint = function(){
            this.printTable();
        };

        this.showDialog = function(){
            app.templates.render('print.list.select-type.html', { }, function(html){
                _this.modal_controller = new app.modal.ModalController({
                    title: 'Напечатать список счетов',
                    content: html,
                    onShow: function(controller){
                        $('#print-doc-by-doc').on('click', function(e){
                            e.preventDefault();
                            _this.print_type = 'doc-by-doc';
                            _this.doDocByDocPrint();
                        });

                        $('#print-list').on('click', function(e){
                            e.preventDefault();
                            _this.modal_controller.close();
                            _this.print_type = 'list';
                        });
                    },
                    onClose: function(){
                        if(_this.print_type == 'list'){
                            _this.doListPrint();
                        }

                        app.loading.unSetGlobalLoading('app.print.docbydoc');
                    },
                    draggable: true
                });

                _this.modal_controller.open();
            });
        };

        this.printDocByDoc = function(options){
            var pool_checklist = [],
                docs = [],
                countPool = function(){
                    var cc = 0;

                    for(var i = 0, l = pool_checklist.length; i < l; i++){
                        if(pool_checklist[i].completed === false){
                            cc++;
                        }
                    }

                    return cc;
                },

                setCompleted = function(id){
                    for(var i = 0, l = pool_checklist.length; i < l; i++){
                        if(pool_checklist[i].id == id){
                            pool_checklist[i].completed = true;
                        }
                    }
                },

                completeGather = function(){
                    app.loading.unSetGlobalLoading('app.print.docbydoc');

                    var html = '';

                    for(var i = 0, l = docs.length; i < l; i++){
                        html += docs[i];

                        if(i < docs.length - 1){
                            html += '<div class="page-separator"></div>';
                        }
                    }

                    if(options.onGatherComplete){
                        options.onGatherComplete();
                    }

                    var docview_controller = new app.docview.DocviewController({
                        title: 'Просмотр списка счетов',
                        content: html,
                        url: '/view',
                        tools: _this.options.tools,
                        onShow: function(controller){

                        },
                        onReady: function(controller){
                            controller.printIframeContent();
                        }
                    });

                    docview_controller.open();
                },

                addPool = function(id){
                    pool_checklist.push({ completed: false, id: id });

                    $.ajax({
                        url: _this.options.doc_by_doc_url + '/' + id,
                        type: 'get',
                        dataType: 'html',
                        success: function(data){
                            var $data = $(data);

                            docs.push($($data[3]).html());

                            setCompleted(id);

                            if(countPool() <= 0){
                                completeGather();
                            }
                        },
                        error: function(){
                            setCompleted(id);

                            if(countPool() <= 0){
                                completeGather();
                            }
                        }
                    });
                };

            app.loading.setGlobalLoading('app.print.docbydoc');

            for(var i = 0, l = this.options.ids.length; i < l; i++){
                addPool(this.options.ids[i]);
            }
        };

        this.printTable = function(){
            var docview_controller = new app.docview.DocviewController({
                title: 'Просмотр списка счетов',
                post: {
                    ids: this.options.ids
                },
                tools: this.options.tools,
                url: this.options.list_url,
                onReady: function(controller){
                    controller.printIframeContent();
                }
            });

            docview_controller.open();
        };

        this.select = function(type){
            if(!type){
                this.showDialog();
            }else{
                if(type == 'doc-by-doc'){
                    this.doDocByDocPrint();
                }else{
                    this.doListPrint();
                }
            }
        };
    }
};
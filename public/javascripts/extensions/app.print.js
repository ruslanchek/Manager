app.print = {
    PrintListController: function(options){
        var _this = this;

        this.options = {
            table_selector: '.items-table',
            ids: []
        };

        $.extend(this.options, options);

        this.$table = $(this.options.table_selector);

        if(this.$table.length <= 0){
            return;
        }

        this.showDialog = function(){
            var print_type = '';

            app.templates.render('print.list.select-type.html', { }, function(html){
                var modal_controller = new app.modal.ModalController({
                    title: 'Напечатать список счетов',
                    content: html,
                    onShow: function(controller){
                        $('#print-doc-by-doc').on('click', function(e){
                            e.preventDefault();
                            print_type = 'doc-by-doc';

                            _this.printDocByDoc({
                                onGatherComplete: function(){
                                    modal_controller.close();
                                }
                            });
                        });

                        $('#print-list').on('click', function(e){
                            e.preventDefault();
                            modal_controller.close();
                            print_type = 'list';
                        });
                    },
                    onClose: function(){
                        if(print_type == 'list'){
                            _this.printTable();
                        }

                        app.loading.unSetGlobalLoading('app.print.docbydoc');
                    },
                    draggable: true
                });

                modal_controller.open();
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
                        html += '<div class="blank-print">' + docs[i] + '</div>';
                    }

                    if(options.onGatherComplete){
                        options.onGatherComplete();
                    }

                    var docview_controller = new app.docview.DocviewController({
                        title: 'Просмотр списка счетов',
                        type: 'html',
                        content: html,
                        onReady: function(){
                            window.print();
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
                url: this.options.list_url,
                onReady: function(){
                    window.print();
                }
            });

            docview_controller.open();
        };

        this.select = function(){
            this.showDialog();
        };
    }
};
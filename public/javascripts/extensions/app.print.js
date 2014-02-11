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
                        $('#print-doc-by-doc').on('click', function(){
                            print_type = 'doc-by-doc';
                        });

                        $('#print-list').on('click', function(){
                            modal_controller.close();
                            print_type = 'list';
                        });
                    },
                    onClose: function(){
                        if(print_type == 'doc-by-doc'){

                        }else{
                            _this.printTable();
                        }
                    },
                    draggable: true
                });

                modal_controller.open();
            });
        };

        this.printTable = function(){
            var docview_controller = new app.docview.DocviewController({
                title: 'Просмотр списка счетов',
                post: {
                    ids: this.options.ids
                },
                url: '/accounts/viewlist',
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
app.sections.accounts = {
    fields: {
        number      : '#number',
        date        : '#date',
        comment     : '#comment',
        contractor  : '#contractor',
        status      : '#status',
        items       : '#items'
    },

    viewDocument: function(docview_tools_show){
        var data = {
                sum: 0
            };

        $.each(this.fields, function(key, val){
            switch(key){
                case 'items' : {
                    try{
                        data[key] = JSON.parse(decodeURIComponent($(val).val()));
                    }catch(e){
                        data[key] = [];
                    }

                    for(var i = 0, l = data[key].length; i < l; i++){
                        data[key][i].sum = data[key][i].price * data[key][i].count;

                        data.sum += parseFloat(data[key][i].price * data[key][i].count);
                    }

                    data[key] = encodeURIComponent(JSON.stringify(data[key]));
                } break;

                default : {
                    data[key] = $(val).val();
                } break;
            }
        });

        new app.docview.DocviewController({
            title: 'Просмотр счета',
            tools: docview_tools_show,
            post: data,
            url: '/accounts/view'
        }).open();
    },

    delete: function(ids, done){
        $.ajax({
            url: '/accounts/delete',
            data: {
                ids: ids
            },
            type: 'post',
            dataType: 'json',
            beforeSend: function(){
                app.loading.setGlobalLoading('app.sections.accounts.delete');
            },
            success: function(data){
                app.loading.unSetGlobalLoading('app.sections.accounts.delete');

                if(data.success == true){
                    if(done){
                        done(ids);
                    }
                }
            },
            error: function(){
                app.loading.unSetGlobalLoading('app.sections.accounts.delete');
            }
        });
    },

    list: {
        all_selected: false,
        selected: [],

        selectAllToggle: function(){
            if($('.cb-all').prop('checked') === true){
                $('.cb-item').attr('checked', 'checked').prop('checked', true);
            }else{
                $('.cb-item').removeAttr('checked').prop('checked', false);
            }

            this.processCheckboxes();
        },

        processCheckboxes: function(){
            var _this = this;
            this.selected = [];

            $('.cb-item').each(function(){
                if($(this).prop('checked') === true){
                    _this.selected.push($(this).data('id'));
                }
            });

            if(this.selected.length > 0){
                $('.multi-action').addClass('show');
            } else {
                $('.multi-action').removeClass('show');
            }
        },

        delete: function(){
            if(confirm('Удалить выбранные счета?')){
                app.sections.accounts.delete(this.selected, function(ids){
                    var ids_selectors = '',
                        $table = $('table#items-table');

                    for(var i = 0, l = ids.length; i < l; i++){
                        ids_selectors += 'tr[data-id="' + ids[i] + '"],';
                    }

                    ids_selectors = ids_selectors.substr(0, ids_selectors.length - 1);

                    $table.find(ids_selectors).remove();

                    if($table.find('tr').length <= 1){
                        $('.table-container').hide();
                        $('.table-empty').show();
                    }

                    $('.multi-action').removeClass('show');
                });
            }
        },

        binds: function(){
            var _this = this;

            $('.cb-all').on('change', function(){
                _this.selectAllToggle();
            });

            $('.cb-item').on('change', function(){
                _this.processCheckboxes();
            });

            $('#delete').on('click', function(e){
                _this.delete();
                e.preventDefault();
            });
        },

        init: function(){
            this.dpc_from = new app.datepicker.DatepickerController({
                input_selector: '#filter-date-from'
            });

            this.dpc_to = new app.datepicker.DatepickerController({
                input_selector: '#filter-date-to'
            });

            this.binds();
        }
    },

    add: {
        binds: function(){
            $('.view-invoice').on('click', function(e){
                app.sections.accounts.viewDocument(false);
                e.preventDefault();
            });
        },

        init: function(){
            this.form_controller = new app.form.FormController({
                form_selector: '#form-add-account',
                url: '/accounts/add',
                fields: app.sections.accounts.fields,
                messages: {
                    OK: 'Счет создан',
                    NUMBER_DOES_NOT_MATCH_PATTERN: 'Неправильный номера счета',
                    NUMBER_EMPTY: 'Не введен номер счета',
                    DUBLICATE_NUMBER_FOUND: 'Счет с таким номером уже существует'
                },
                onSuccess: function(data){
                    if(data.data && data.data._id){
                        setTimeout(function(){
                            document.location.href = '/accounts/edit/' + data.data._id;
                        }, 300);
                    }
                }
            });

            this.datepicker_controller = new app.datepicker.DatepickerController({
                input_selector: '#date'
            });

            this.items_selector_controller = new app.items_selector.ItemsSelectorController({
                container_selector: '#items-selector',
                onChange: function(data){
                    $('#items').val(encodeURIComponent(JSON.stringify(data)));
                }
            });

            $('#number').focus();

            this.binds();
        }
    },

    edit: {
        download: function(){

        },

        print: function(){

        },

        send: function(){
            var modal = new app.modal.ModalController({
                title: 'Отправить счет по почте',
                content: 'Content',
                onShow: function(controller){

                },
                onClose: function(){

                },
                draggable: true
            });

            modal.open();
        },

        delete: function(){
            if(confirm('Удалить счет?')){
                app.sections.accounts.delete([this.id], function(ids){
                    setTimeout(function(){
                        document.location.href = '/accounts';
                    }, 300);
                });
            }
        },

        binds: function(){
            var _this = this,
                $body = $('body');

            $body.on('click.action-download', '.action-download', function(e){
                _this.download();
                e.preventDefault();
            });

            $body.on('click.action-print', '.action-print', function(e){
                _this.print();
                e.preventDefault();
            });

            $body.on('click.action-send', '.action-send', function(e){
                _this.send();
                e.preventDefault();
            });

            $body.on('click.action-delete', '.action-delete', function(e){
                _this.delete();
                e.preventDefault();
            });

            $('.view-invoice').on('click', function(e){
                app.sections.accounts.viewDocument(true);
                e.preventDefault();
            });
        },

        init: function(id){
            this.id = id;

            this.form_controller = new app.form.FormController({
                form_selector: '#form-edit-account',
                url: '/accounts/edit/' + id,
                fields: app.sections.accounts.fields,
                messages: {
                    OK: 'Изменения сохранены',
                    NUMBER_DOES_NOT_MATCH_PATTERN: 'Неправильный номера счета',
                    NUMBER_EMPTY: 'Не введен номер счета',
                    DUBLICATE_NUMBER_FOUND: 'Счет с таким номером уже существует'
                },
                onSuccess: function(data){
                    if(data.data && data.data._id){
                        $('#header-item-name').html('Счет №' + data.data.number);
                        $('#header-item-date').html('от ' + app.utils.humanizeDate(new Date(data.data.date)));
                    }
                }
            });

            this.datepicker_controller = new app.datepicker.DatepickerController({
                input_selector: '#date'
            });

            this.items_selector_controller = new app.items_selector.ItemsSelectorController({
                container_selector: '#items-selector',
                data: JSON.parse(decodeURIComponent($('#items').val())),
                onChange: function(data){
                    $('#items').val(encodeURIComponent(JSON.stringify(data)));
                }
            });

            $('#number').focus();

            this.binds();
        }
    }
};
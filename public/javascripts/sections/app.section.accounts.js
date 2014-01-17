app.sections.accounts = {
    fields: {
        number      : '#number',
        date        : '#date',
        comment     : '#comment',
        contractor  : '#contractor',
        status      : '#status'
    },

    viewDocument: function(){
        var data = {};

        $.each(this.fields, function(key, val){
            data[key] = $(val).val();
        });

        app.templates.renderForced('blank.invoice.html', data, function(html){
            new app.docview.DocviewController({
                title: 'Просмотр счета',
                content: html
            }).open();
        });
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
            this.binds();
        }
    },

    add: {
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

            $('#number').focus();
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
            var _this = this;

            $('#download').on('click', function(e){
                _this.download();
                e.preventDefault();
            });

            $('#print').on('click', function(e){
                _this.print();
                e.preventDefault();
            });

            $('#send').on('click', function(e){
                _this.send();
                e.preventDefault();
            });

            $('#delete').on('click', function(e){
                _this.delete();
                e.preventDefault();
            });

            $('.view-invoice').on('click', function(e){
                app.sections.accounts.viewDocument();
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
                container_selector: '#items-selector'
            });

            this.binds();
        }
    }
}
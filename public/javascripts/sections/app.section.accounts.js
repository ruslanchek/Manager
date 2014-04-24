app.sections.accounts = {
    fields: {
        number      : '#number',
        date        : '#date',
        comment     : '#comment',
        contractor  : '#contractor',
        status      : '#status',
        items       : '#items'
    },

    messages: {
        NUMBER_DOES_NOT_MATCH_PATTERN: 'Неправильный номера счета',
        NUMBER_EMPTY: 'Не введен номер счета',
        DUBLICATE_NUMBER_FOUND: 'Счет с таким номером уже существует',
        CONTRACTOR_EMPTY: 'Не выбран контрагент, выберите или создайте нового'
    },

    contractor: {
        _id: ''
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
                        $table = $('table.items-table');

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

        print: function(){
            var print_list_controller = new app.print.PrintListController({
                ids: this.selected,
                list_url: '/accounts/viewlist',
                doc_by_doc_url: '/accounts/view'
            });

            print_list_controller.select();
        },

        binds: function(){
            var _this = this;

            $('.cb-all').on('change', function(){
                _this.selectAllToggle();
            });

            $('.cb-item').on('change', function(){
                _this.processCheckboxes();
            });

            $('#print').on('click', function(e){
                e.preventDefault();
                _this.print();
            });

            $('#delete').on('click', function(e){
                e.preventDefault();
                _this.delete();
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
        viewDocument: function(){
            var data = {
                sum: 0
            };

            app.sections.contractors.loadContractorData(app.sections.accounts.contractor._id, function(contractor_data){
                $.each(app.sections.accounts.fields, function(key, val){
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

                if(contractor_data !== null) {
                    data.contractor = encodeURIComponent(JSON.stringify(contractor_data));
                }else{
                    data.contractor = '{}';
                }

                var docview_controller = new app.docview.DocviewController({
                    title: 'Просмотр счета',
                    tools: false,
                    data: data,
                    url: '/accounts/viewcustom'
                });

                docview_controller.open();
            });
        },

        binds: function(){
            $('#preview').on('click', function(e){
                app.sections.accounts.add.viewDocument();
                e.preventDefault();
            });
        },

        init: function(){
            this.form_controller = new app.form.FormController({
                form_selector: '#form-add-account',
                url: '/accounts/add',
                fields: app.sections.accounts.fields,
                messages: $.extend(app.sections.accounts.messages, {
                    OK: 'Изменения сохранены'
                }),
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

            this.contractor_select_controller = new app.contractor_select.ContractorSelectController({
                selector: '.contractor-selection-placeholder',
                element_id: 'contractor',
                onSelect: function(data){
                    app.sections.accounts.contractor._id = data;
                },
                onContractorAdd: function(data){
                    app.sections.accounts.contractor._id = data;
                }
            });

            $('#number').focus();

            this.binds();
        }
    },

    edit: {
        viewDocument: function(){
            var id = this.id;

            var docview_controller = new app.docview.DocviewController({
                title: 'Просмотр счета',
                tools: true,
                form_controller: this.form_controller,
                method: 'get',
                data: {},
                onDownload: function () {
                    document.location.href = '/accounts/pdf/' + id;
                },
                onSend: function () {
                    app.sections.accounts.edit.send();
                },
                url: '/accounts/view/' + id
            });

            docview_controller.open();
        },

        download: function(){
            /*if(!confirm('Внимание, перед скачиванием документ будет сохранен. Продолжить?')){
                return;
            }*/

            this.form_controller.submitForm(function (data) {
                document.location.href = '/accounts/pdf/' + app.sections.accounts.edit.id;
            });
        },

        print: function(){
            var print_list_controller = new app.print.PrintListController({
                ids: [ this.id ],
                list_url: '/accounts/viewlist',
                doc_by_doc_url: '/accounts/view'
            });

            print_list_controller.select('doc-by-doc');
        },

        send: function(){
            var _this = this;

            app.sections.contractors.loadContractorData(app.sections.accounts.contractor._id, function(contractor_data){
                var email = '';

                if(contractor_data && contractor_data.cc_email){
                    email = contractor_data.cc_email;
                }

                var senddoc_controller = new app.senddoc.SendDocController({
                    message_template: 'Здравствуйте, во вложении счет №{{doc_num}} от компании {{cc_type_name}} &laquo;{{cc_name}}&raquo;.',
                    doc_num: $('#number').val(),
                    email: email,
                    title: 'Отправить счет по почте',
                    doc_id: _this.id,
                    url: '/accounts/send/' + _this.id
                });
            });
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

            $body.on('click.action-view', '.action-view', function(e){
                app.sections.accounts.edit.viewDocument();
                e.preventDefault();
            });

            $body.on('click.action-print', '.action-print', function(e){
                _this.print();
                e.preventDefault();
            });

            $body.on('click.action-download', '.action-download', function(e){
                _this.download();
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
        },

        init: function(id, contractor_id){
            this.id = id;
            app.sections.accounts.contractor._id = contractor_id;

            this.form_controller = new app.form.FormController({
                form_selector: '#form-edit-account',
                url: '/accounts/edit/' + id,
                fields: app.sections.accounts.fields,
                messages: $.extend(app.sections.accounts.messages, {
                    OK: 'Изменения сохранены'
                }),
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

            this.contractor_select_controller = new app.contractor_select.ContractorSelectController({
                selector: '.contractor-selection-placeholder',
                element_id: 'contractor',
                selected_id: contractor_id,
                onSelect: function(data){
                    if(data && data != '') {
                        app.sections.accounts.contractor._id = data;

                        app.sections.contractors.loadContractorData(data, function (contractor_data) {
                            if (contractor_data !== null) {
                                app.sections.accounts.contractor = contractor_data;
                            }
                        });
                    }else{
                        app.sections.accounts.contractor = { _id: '' };
                    }
                }
            });

            $('#number').focus();

            this.binds();
        }
    }
};
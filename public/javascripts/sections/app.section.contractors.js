app.sections.contractors = {
    fields: {
        cc_type: '#cc_type',
        cc_name: '#cc_name',
        cc_inn: '#cc_inn',
        cc_kpp: '#cc_kpp',
        cc_ogrn: '#cc_ogrn',

        cc_ceo_name: '#cc_ceo_name',
        cc_ceo_type: '#cc_ceo_type',
        cc_accountant_name: '#cc_accountant_name',
        cc_accountant_type: '#cc_accountant_type',

        cc_city: '#cc_city',
        cc_index: '#cc_index',
        cc_street: '#cc_street',
        cc_house: '#cc_house',

        bank_name: '#bank_name',
        bank_bik: '#bank_bik',
        bank_pay_account: '#bank_pay_account',
        bank_corr_account: '#bank_corr_account',

        cc_phone: '#cc_phone',
        cc_fax: '#cc_fax',
        cc_email: '#cc_email',
        cc_skype: '#cc_skype',
        cc_website: '#cc_website'
    },

    messages: {
        CC_NAME_EMPTY: 'Наименование не заполнено',
        CC_INN_EMPTY: 'ИНН не заполнен',
        CC_KPP_EMPTY: 'КПП не заполнен',
        CC_OGRN_EMPTY: 'ОГРН не заполнен',
        CC_CEO_NAME_EMPTY: 'Имя руководителя не заполнено',

        CC_CITY_EMPTY: 'Город не заполнен',
        CC_INDEX_EMPTY: 'Индекс не заполнен',
        CC_STREET_EMPTY: 'Улица заполнена',
        CC_HOUSE_EMPTY: 'Дом не заполнен',

        BANK_PAY_ACCOUNT_EMPTY: 'Не заполнен расчетный счет',
        BANK_BIK_EMPTY: 'Не заполнен БИК',
        BANK_NAME_EMPTY: 'Не заполнено название банка',
        BANK_CORR_ACCOUNT_EMPTY: 'Не заполнен корреспондентский счет',

        DUBLICATE_FOUND: 'Контрагент с таким названием уже существует'
    },

    loadContractorData: function(id, done){
        if(id && id != '') {
            $.ajax({
                url: '/contractors/getitem/' + id,
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    app.loading.setGlobalLoading('app.sections.contractors.loadContractorData');
                },
                success: function (data) {
                    app.loading.unSetGlobalLoading('app.sections.contractors.loadContractorData');

                    if (done && data.success == true) {
                        done(data.data);
                    } else {
                        done(null);
                    }
                },
                error: function () {
                    app.loading.unSetGlobalLoading('app.sections.contractors.loadContractorData');
                }
            });
        }else{
            done(null);
        }
    },

    fieldsActions: function(){
        $('#cc_type').on('change', function () {
            if ($(this).val() == '4') {
                $('label[for=cc_ogrn]').text('ОГРНИП');
                $('#kpp-item').hide();
                $('#cc_ceo_type_block').hide();
                $('#cc_ceo_type').val('4').trigger("chosen:updated");

            } else {
                $('label[for=cc_ogrn]').text('ОГРН');
                $('#kpp-item').show();
                $('#cc_ceo_type_block').show();
                $('#cc_ceo_type').val('1').trigger("chosen:updated");
            }
        });

        $('#cc_accountant_type').on('change', function () {
            if ($(this).val() == '1') {
                $('#cc_accountant_name_block').hide();
            } else {
                $('#cc_accountant_name_block').show();
            }

            app.sections.company.setSlidePosition(app.sections.company.current_slide);
        });

        this.kladr_controller = new app.kladr_address.KladrAddressController({
            city: '#cc_city',
            street: '#cc_street',
            house: '#cc_house',
            index: '#cc_index'
        });
    },

    delete: function(ids, done){
        $.ajax({
            url: '/contractors/delete',
            data: {
                ids: ids
            },
            type: 'post',
            dataType: 'json',
            beforeSend: function(){
                app.loading.setGlobalLoading('app.sections.contractors.delete');
            },
            success: function(data){
                app.loading.unSetGlobalLoading('app.sections.contractors.delete');

                if(data.success == true){
                    if(done){
                        done(ids);
                    }
                }
            },
            error: function(){
                app.loading.unSetGlobalLoading('app.sections.contractors.delete');
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
            if(confirm('Удалить выбранных контрагентов?')){
                app.sections.contractors.delete(this.selected, function(ids){
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

        binds: function(){
            var _this = this;

            $('.cb-all').on('change', function(){
                _this.selectAllToggle();
            });

            $('.cb-item').on('change', function(){
                _this.processCheckboxes();
            });

            $('#delete').on('click', function(e){
                e.preventDefault();
                _this.delete();
            });


        },

        init: function(){
            this.binds();
        }
    },

    add: {
        binds: function(){
            app.sections.contractors.fieldsActions();
        },

        init: function(){
            this.form_controller = new app.form.FormController({
                form_selector: '#form-add-contractor',
                url: '/contractors/add',
                fields: app.sections.contractors.fields,
                messages: $.extend(app.sections.contractors.messages, {
                    OK: 'Контрагент создан'
                }),
                onSuccess: function(data){
                    if(data.data && data.data._id){
                        setTimeout(function(){
                            document.location.href = '/contractors/edit/' + data.data._id;
                        }, 300);
                    }
                }
            });

            $('#number').focus();

            this.binds();
        }
    },

    edit: {
        delete: function(){
            if(confirm('Удалить контрагента?')){
                app.sections.contractors.delete([this.id], function(ids){
                    setTimeout(function(){
                        document.location.href = '/contractors';
                    }, 300);
                });
            }
        },

        binds: function(){
            var _this = this,
                $body = $('body');

            $body.on('click.action-delete', '.action-delete', function(e){
                _this.delete();
                e.preventDefault();
            });

            app.sections.contractors.fieldsActions();
        },

        init: function(id){
            this.id = id;

            this.form_controller = new app.form.FormController({
                form_selector: '#form-edit-contractor',
                url: '/contractors/edit/' + id,
                fields: app.sections.contractors.fields,
                messages: $.extend(app.sections.contractors.messages, {
                    OK: 'Изменения сохранены'
                }),
                onSuccess: function(data){
                    if(data.data && data.data._id){
                        $('#header-item-name').html('Счет №' + data.data.number);
                        $('#header-item-date').html('от ' + app.utils.humanizeDate(new Date(data.data.date)));
                    }
                }
            });

            this.binds();
        }
    }
};
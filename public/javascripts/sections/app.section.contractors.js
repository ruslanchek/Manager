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

        form_mode: '#form_mode',
        id: '#id',

        cc_phone: '#cc_phone',
        cc_fax: '#cc_fax',
        cc_email: '#cc_email',
        cc_skype: '#cc_skype',
        cc_website: '#cc_website'
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

            $('#number').focus();

            this.binds();
        }
    },

    edit: {
        delete: function(){
            if(confirm('Удалить контрагента?')){
                app.sections.accounts.delete([this.id], function(ids){
                    setTimeout(function(){
                        document.location.href = '/contragents';
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
        },

        init: function(id){
            this.id = id;

            this.form_controller = new app.form.FormController({
                form_selector: '#form-edit-contractor',
                url: '/contragents/edit/' + id,
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

            this.binds();
        }
    }
};
app.contractor_select = {
    ContractorSelectController: function(options){
        var _this = this;

        this.options = {
            selector: '',
            element_id: 'contractor',
            selected_id: false,
            onSelect: function(data){

            },
            onContractorAdd: function(data){

            }
        };

        $.extend(this.options, options);

        this.$placeholder = $(this.options.selector);

        this.loadContractors = function(){
            $.ajax({
                url: '/contractors/getlist',
                type: 'post',
                dataType: 'json',
                beforeSend: function(){
                    app.loading.setElementLoading(_this.options.selector);
                },
                success: function(data){
                    var contractors_parsed = [];

                    for(var i = 0, l = data.data.length; i < l; i++){
                        contractors_parsed.push({
                            id: data.data[i]._id,
                            name: app.utils.getCompanyTypeName(data.data[i].cc_type) + ' &laquo;' + data.data[i].cc_name + '&raquo;',
                            selected: (_this.options.selected_id == data.data[i]._id)
                        });
                    }

                    app.templates.render('contractor.select.html', { contractors: contractors_parsed, element_id: _this.options.element_id }, function(html){
                        app.loading.unSetElementLoading(_this.options.selector);

                        _this.$placeholder.append(html);
                        _this.$placeholder.find('select').chosen(app.chosen_options);
                        _this.$placeholder.find('select').on('change', function(){
                            if(_this.options.onSelect){
                                _this.options.onSelect($(this).val());
                            }
                        });

                        $('.create-contractor').on('click', function(e){
                            e.preventDefault();

                            _this.contractor_create_controller = new app.contractor_select.ContractorCreateController({
                                onContractorAdd: function(data){
                                    _this.options.onContractorAdd(data);
                                    _this.options.selected_id = data._id;
                                    _this.$placeholder.empty();
                                    _this.loadContractors();
                                }
                            });
                        });

                    }, function(){

                    }, function(){

                    });
                },
                error: function(){
                    app.loading.unSetElementLoading(_this.options.selector);
                }
            });
        };

        this.loadContractors();
    },

    ContractorCreateController: function(options){
        var _this = this;

        this.options = {
            onContractorAdd: function(data){

            }
        };

        $.extend(this.options, options);

        this.draw = function(){
            app.templates.render('contractor.create.html', {  }, function(html) {
                _this.modal_controller = new app.modal.ModalController({
                    title: 'Создание контрагента',
                    content: html,
                    onShow: function (controller) {
                        $('.modal select').chosen(app.chosen_options);

                        $('#cc_type').on('change', function () {
                            if ($(this).val() == '4') {
                                $('label[for=cc_ogrn] span').text('ОГРНИП');
                                $('#kpp-item').hide();
                                $('#cc_ceo_type_block').hide();
                                $('#cc_ceo_type').val('4').trigger("chosen:updated");

                            } else {
                                $('label[for=cc_ogrn] span').text('ОГРН');
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

                        var kladr_controller = new app.kladr_address.KladrAddressController({
                            city: '#cc_city',
                            street: '#cc_street',
                            house: '#cc_house',
                            index: '#cc_index'
                        });

                        _this.tabs_controller = new app.tabs.tabsController();

                        _this.form_controller = new app.form.FormController({
                            form_selector: '#form-contractor-create',
                            url: '/contractors/add',
                            fields: app.sections.contractors.fields,
                            messages: $.extend(app.sections.contractors.messages, {
                                OK: 'Контрагент создан'
                            }),
                            onFail: function(data){
                                if(data.fields && data.fields[0]){
                                    var $field = $('#' + data.fields[0]);

                                    $('#form-contractor-create .tab-content').each(function(){
                                        if($(this).find($field).length > 0){
                                            var tab_id = $(this).data('tab');

                                            _this.tabs_controller.openTab(tab_id);
                                        }
                                    });
                                }
                            },
                            onSuccess: function(data){
                                if(data.success == true){
                                    setTimeout(function(){
                                        _this.modal_controller.close();
                                        _this.options.onContractorAdd(data.data);
                                    }, 500);
                                }
                            }
                        });
                    },
                    onClose: function () {

                    },
                    draggable: true,
                    width: 650
                });

                _this.modal_controller.open();
            });
        };

        this.draw();
    }
};
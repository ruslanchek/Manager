app.contractor_select = {
    ContractorSelectController: function(options){
        var _this = this;

        this.options = {
            selector: '',
            element_id: 'contractor',
            selected_id: false,
            onSelect: function(data){

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
                        _this.$placeholder.append(html);
                        _this.$placeholder.find('select').chosen(app.chosen_options);
                        _this.$placeholder.find('select').on('change', function(){
                            if(_this.options.onSelect){
                                _this.options.onSelect($(this).val());
                            }
                        });

                        $('.create-contractor').on('click', function(e){
                            e.preventDefault();
                            _this.contractor_select_controller = new app.contractor_select.ContractorCreateController({

                            });
                        });

                    }, function(){

                    }, function(){
                        app.loading.unSetElementLoading(_this.options.selector);
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

        };

        $.extend(this.options, options);

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

                    new app.tabs.tabsController();
                },
                onClose: function () {

                },
                draggable: true,
                width: 650
            });

            _this.modal_controller.open();
        });
    }
};
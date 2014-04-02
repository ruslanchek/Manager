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
    }
};
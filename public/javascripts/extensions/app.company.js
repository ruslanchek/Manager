app.company = {
    CompanySelectController: function(){
        var _this = this;

        this.companies = [];

        this.getCompanies = function(done){
            $.ajax({
                url: '/company/list',
                type: 'post',
                dataType: 'json',
                beforeSend: function(){
                    app.loading.setGlobalLoading('companies-list');
                },
                success: function(data){
                    app.loading.unSetGlobalLoading('companies-list');

                    _this.companies = data;

                    if(done){
                        done(data);
                    }
                },
                error: function(){
                    app.loading.unSetGlobalLoading('companies-list');
                }
            });
        };

        this.getCompanyById = function(id){
            for(var i = 0, l = this.companies.length; i < l; i++){
                if(this.companies[i]._id == id){
                    return this.companies[i];
                }
            }
        };

        this.openSelector = function(){
            this.getCompanies(function(data){
                for(var i = 0, l = data.data.length; i < l; i++){
                    data.data[i]._cc_type_name = app.utils.getCompanyTypeName(data.data[i].cc_type);

                    if(data.data[i]._id == data.current_company){
                        data.data[i]._active = true;
                    }
                }

                app.templates.render('common.company-select.html', { companies: data.data }, function(html){
                    var modal_controller = new app.modal.ModalController({
                        title: 'Список компаний',
                        content: html,
                        no_padding: true,
                        onShow: function(controller){
                            var $item = controller.$modal.find('.content .item');

                            $item.off('click').on('click', function(e){
                                e.preventDefault();
                                var id = $(this).data('id');

                                $item.removeClass('active');

                                $(this).addClass('active');
                            });

                            $item.find('.edit-company').off('click').on('click', function(e){
                                e.preventDefault();
                                var id = $(this).data('id');

                                document.location.href = '/company/edit/' + id;
                            });
                        },
                        onClose: function(){

                        },
                        draggable: true,
                        width: 400
                    });

                    modal_controller.open();
                });
            });
        };

        this.renderSelector = function(type_name, name){
            $('.company-selector').html(
                '<i class="icon-briefcase"></i>' +
                '<span id="global-company-type">' + type_name + '</span>&nbsp;&laquo;' +
                '<span id="global-company-name">' + name + '</span>&raquo;'
            ).fadeIn(200);
        };

        $('.company-selector').off('click').on('click', function(){
            _this.openSelector();
        });
    },

    noCompany: function(){
        if(document.location.pathname != '/company/add'){
            document.location.href = '/company/add';
        }
    }
};
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

        this.selectCompany = function(id, m_controller, done){
            $.ajax({
                url: '/company/selectcompany',
                data: {
                    id: id
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function(){
                    m_controller.setLoading();
                },
                success: function(data){
                    if(done){
                        done(data);
                    }

                    setTimeout(function(){
                        m_controller.unSetLoading();
                    }, 300);
                },
                error: function(){
                    m_controller.unSetLoading();
                }
            });
        };

        this.deleteCompany = function(id, m_controller, done){
            $.ajax({
                url: '/company/deletecompany',
                data: {
                    id: id
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function(){
                    m_controller.setLoading();
                },
                success: function(data){
                    if(done){
                        done(data);
                    }

                    setTimeout(function(){
                        m_controller.unSetLoading();
                    }, 300);
                },
                error: function(){
                    m_controller.unSetLoading();
                }
            });
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

                            $item.find('a.company-name').off('click').on('click', function(e){
                                e.preventDefault();

                                var $clicked = $(this),
                                    id = $clicked.data('id'),
                                    name = $clicked.data('name'),
                                    type = $clicked.data('type');

                                _this.selectCompany(id, controller, function(data){
                                    if(data.success === true){
                                        $item.removeClass('active');
                                        $clicked.parent().addClass('active');

                                        _this.renderSelector(app.utils.getCompanyTypeName(type), name);

                                        setTimeout(function(){
                                            controller.close();

                                            setTimeout(function(){
                                                document.location.href = '/';
                                            }, 200);
                                        }, 300);
                                    }
                                });
                            });

                            $item.find('.edit-company').off('click').on('click', function(e){
                                e.preventDefault();
                                var id = $(this).data('id');

                                document.location.href = '/company/edit/' + id;
                            });

                            $item.find('.delete-company').off('click').on('click', function(e){
                                e.preventDefault();
                                var id = $(this).data('id'),
                                    $clicked = $(this);

                                if(confirm('Внимание! Вместе с компанией будут удалены все ее документы, номенклатура и контрагенты! Вы действительно хотите продолжить?')){
                                    _this.deleteCompany(id, controller, function(data){
                                        if(data.success == true){
                                            var $it = controller.$modal.find('.content .item[data-id="' + id + '"]');

                                            $it.slideUp(300, function(){
                                                $it.remove();

                                                if(id == data.data.current_company || data.data.current_company == null){
                                                    var next_id = controller.$modal.find('.content .item:first').data('id');

                                                    if(!next_id){
                                                        controller.close();

                                                        controller.options.onClose = function(){
                                                            app.noCompanies();
                                                        }
                                                    }else{
                                                        _this.selectCompany(next_id, controller, function(data){
                                                            if(data.success == true){
                                                                $item.removeClass('active');
                                                                controller.$modal.find('.content .item:first').addClass('active');

                                                                controller.options.onClose = function(){
                                                                    document.location.href = '/';
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        },
                        onClose: function(){

                        },
                        draggable: true,
                        width: 420
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
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

                app.templates.render('common.company-select.html', { companies: data.data }, function(html){
                    var modal_controller = new app.modal.ModalController({
                        title: 'Список компаний',
                        content: html,
                        onShow: function(controller){

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
app.sections.nomenclature = {
    addNomgroup: function(){
        app.templates.render('nomenclature.add.html', {  }, function(html){
            app.sections.nomenclature.mc_add = new app.modal.ModalController({
                title: 'Создание категории номернклатуры',
                content: html,
                onShow: function(controller){
                    new app.form.FormController({
                        form_selector: '#form-nomenclature-add',
                        url: '/nomenclature/addnomgroup',
                        fields: { name: '#fna_name' },
                        messages: {
                            OK: 'Группа создана',
                            NAME_DOES_NOT_MATCH_PATTERN: 'Наименование некоректно',
                            DUBLICATE_NAME_FOUND: 'Категория с таким названием уже существует',
                            NAME_EMPTY: 'Не введено название'
                        },
                        onSuccess: function(data){
                            setTimeout(function(){
                                controller.close();
                                $('.side-menu').append('<a href="/nomenclature/' + data.data._id + '">' + data.data.name + '</a>');
                            }, 350);
                        }
                    });
                },
                onClose: function(){

                },
                width: 530
            }).open();
        });
    },

    selectItem: function(options){
        app.templates.render('nomenclature.select.html', {  }, function(html){
            app.sections.nomenclature.mc_select = new app.modal.ModalController({
                title: 'Выбор позиции из номенклатуры',
                content: html,
                onShow: function(controller){

                },
                onClose: function(){

                },
                width: 600
            }).open();
        });
    },

    list: {
        binds: function(){
            $('#add-nomgroup').on('click', function(e){
                e.preventDefault();
                app.sections.nomenclature.addNomgroup();
            });
        },

        init: function(){
            this.binds();
        }
    }
};
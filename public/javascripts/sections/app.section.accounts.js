app.sections.accounts = {
    add: function(){
        app.templates.render('sections/accounts.form.add.html', {}, function(html){
            var modal = new app.modal.ModalController({
                title: 'Новый счет',
                content: html,
                onShow: function(controller){
                    var form = new app.form.FormController({
                        form_selector: '#form-add-account',
                        url: '/accounts/add',
                        fields: {
                            number: '#number'
                        },
                        messages: {
                            OK: 'Документ создан',
                            NUMBER_DOES_NOT_MATCH_PATTERN: 'Неправильный номера счета',
                            NUMBER_EMPTY: 'Не введен номер счета',
                            DUBLICATE_NUMBER_FOUND: 'Счет с таким номером уже существует'
                        },
                        onSuccess: function(data){
                            console.log(data)

                            setTimeout(function(){
                                controller.close();
                            }, 1000);
                        },
                        from_modal: true,
                        modal_controller: controller
                    });
                },
                onClose: function(){

                },
                width: 800
            });

            modal.open();
        });
    },

    bind: function(){
        $('#add').on('click', function(e){
            app.sections.accounts.add();
            e.preventDefault();
        });
    },

    init: function(){
        this.bind();
    }
}
app.sections.accounts = {
    add: {
        init: function(){
            this.controller = new app.form.FormController({
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
                    if(data.data && data.data._id){
                        setTimeout(function(){
                            document.location.href = '/accounts/edit/' + data.data._id;
                        }, 600);
                    }
                }
            });

            this.binds();
        }
    },

    edit: {
        download: function(){

        },

        print: function(){

        },

        send: function(){
            var modal = new app.modal.ModalController({
                title: 'Отправить счет по почте',
                content: 'Content',
                onShow: function(controller){

                },
                onClose: function(){

                },
                draggable: true
            });

            modal.open();
        },

        delete: function(){

        },

        binds: function(){
            var _this = this;

            $('#download').on('click', function(e){
                _this.download();
                e.preventDefault();
            });

            $('#print').on('click', function(e){
                _this.print();
                e.preventDefault();
            });

            $('#send').on('click', function(e){
                _this.send();
                e.preventDefault();
            });

            $('#delete').on('click', function(e){
                _this.delete();
                e.preventDefault();
            });
        },

        init: function(id){
            this.id = id;

            this.controller = new app.form.FormController({
                form_selector: '#form-edit-account',
                url: '/accounts/edit/' + id,
                fields: {
                    number: '#number'
                },
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
}
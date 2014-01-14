app.sections.accounts = {
    add: function(){
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
                if(data.data && data.data._id){
                    setTimeout(function(){
                        document.location.href = '/accounts/edit/' + data.data._id;
                    }, 600);
                }
            }
        });
    },

    edit: function(id){
        var form = new app.form.FormController({
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
                    $('#header-item-date').html(data.data.date);
                }
            }
        });
    },

    bind: function(){

    },

    init: function(){

    }
}
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
                console.log(data);
            }
        });
    },

    bind: function(){

    },

    init: function(){
        this.add();
    }
}
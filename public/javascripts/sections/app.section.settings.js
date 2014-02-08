app.sections.settings = {
    fields: {
        cc_type             : '#cc_type',
        cc_name             : '#cc_name',
        cc_inn              : '#cc_inn',
        cc_kpp              : '#cc_kpp',
        cc_ogrn             : '#cc_ogrn',
        cc_city             : '#cc_city',
        cc_index            : '#cc_index',
        cc_street           : '#cc_street',
        cc_house            : '#cc_house',
        cc_phone            : '#cc_phone',
        cc_fax              : '#cc_fax',
        cc_email            : '#cc_email',
        cc_skype            : '#cc_skype',
        cc_ceo_name         : '#cc_ceo_name',
        cc_ceo_type         : '#cc_ceo_type',
        cc_accountant_name  : '#cc_accountant_name',
        cc_accountant_type  : '#cc_accountant_type',
        bank_name           : '#bank_name',
        bank_bik            : '#bank_bik',
        bank_pay_account    : '#bank_pay_account',
        bank_corr_account   : '#bank_corr_account'
    },

    typeSelect: function($select){
        if($select.val() == '4'){
            $('label[for=cc_ogrn]').text('ОГРНИП');
            $('#kpp-item').hide();
        }else{
            $('label[for=cc_ogrn]').text('ОГРН');
            $('#kpp-item').show();
        }
    },

    binds: function(){
        $('#cc_type').on('change', function(){
            app.sections.settings.typeSelect($(this));
        });

        $('.side-menu a').on('click', function(e){
            e.preventDefault();
            app.sections.settings.selectCaegory($(this).data('name'));
        });
    },

    selectCaegory: function(name){
        $('.side-menu a, .form-hidden-section').removeClass('active');
        $('.side-menu a[data-name="' + name + '"], .form-hidden-section[data-name="' + name + '"]').addClass('active');
    },

    init: function(){
        this.form_controller = new app.form.FormController({
            form_selector: '#form-edit-company',
            url: '/settings/company',
            fields: app.sections.settings.fields,
            messages: {
                OK: 'Изменения сохранены'
            },
            onSuccess: function(data){
                $('#global-company-type').html($('#cc_type option:selected').html());
                $('#global-company-name').html($('#cc_name').val());
            }
        });

        this.kladr_controller = new app.kladr_address.KladrAddressController({
            city: '#cc_city',
            street: '#cc_street',
            house: '#cc_house',
            index: '#cc_index'
        });

        new app.field.FieldController({
            input_selector: '#cc_index',
            types: [
                {name: 'digits'},
                {name: 'length', param: 6}
            ]
        });

        new app.field.FieldController({
            input_selector: '#bank_pay_account',
            types: [
                {name: 'digits'},
                {name: 'length', param: 20}
            ]
        });

        new app.field.FieldController({
            input_selector: '#bank_corr_account',
            types: [
                {name: 'digits'},
                {name: 'length', param: 20}
            ]
        });

        new app.field.FieldController({
            input_selector: '#cc_inn',
            types: [
                {name: 'digits'},
                {name: 'length', param: 12}
            ]
        });

        new app.field.FieldController({
            input_selector: '#bank_bik',
            types: [
                {name: 'digits'},
				{name: 'length', param: 9}
            ]
        });

        new app.field.FieldController({
            input_selector: '#cc_ogrn',
            types: [
                {name: 'digits'},
                {name: 'length', param: 13}
            ]
        });

        new app.field.FieldController({
            input_selector: '#cc_kpp',
            types: [
                {name: 'digits'},
                {name: 'length', param: 9}
            ]
        });

        this.binds();
    }
};
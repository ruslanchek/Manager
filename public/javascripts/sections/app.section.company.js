app.sections.company = {
    form_width: 960,
    current_slide: 0,
    steps: 4,

    mode: 'add',

    form_data: {
        cc_type             : '',
        cc_name             : '',
        cc_inn              : '',
        cc_kpp              : '',
        cc_ogrn             : '',
        cc_ceo_name         : '',
        cc_ceo_type         : '',
        cc_accountant_name  : '',
        cc_accountant_type  : '',

        cc_city             : '',
        cc_index            : '',
        cc_street           : '',
        cc_house            : '',

        cc_phone            : '',
        cc_fax              : '',
        cc_email            : '',
        cc_skype            : '',
        cc_website          : '',

        bank_name           : '',
        bank_bik            : '',
        bank_pay_account    : '',
        bank_corr_account   : ''
    },

    fields: {
        step1: {
            cc_type             : '#cc_type',
            cc_name             : '#cc_name',
            cc_inn              : '#cc_inn',
            cc_kpp              : '#cc_kpp',
            cc_ogrn             : '#cc_ogrn',

            cc_ceo_name         : '#cc_ceo_name',
            cc_ceo_type         : '#cc_ceo_type',
            cc_accountant_name  : '#cc_accountant_name',
            cc_accountant_type  : '#cc_accountant_type'
        },

        step2: {
            cc_city             : '#cc_city',
            cc_index            : '#cc_index',
            cc_street           : '#cc_street',
            cc_house            : '#cc_house'
        },

        step3: {
            cc_phone            : '#cc_phone',
            cc_fax              : '#cc_fax',
            cc_email            : '#cc_email',
            cc_skype            : '#cc_skype',
            cc_website          : '#cc_website'
        },

        step4: {
            bank_name           : '#bank_name',
            bank_bik            : '#bank_bik',
            bank_pay_account    : '#bank_pay_account',
            bank_corr_account   : '#bank_corr_account'
        }
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

    intro: function(){
        $('.step-names').fadeOut(300);
        $('.progress-bar').slideUp(300);
        $('.form-controls').slideUp(300);
    },

    start: function(){
        $('#form-company').show();

        $('.form-step.active').removeClass('active');
        $('.form-step[data-step="1"]').addClass('active');

        setTimeout(function(){
            $('.step-names').fadeIn(300);
            $('.progress-bar').slideDown(300);
            $('.form-controls').slideDown(300);
        }, 650);

        this.step1();
    },

    finish: function(){
        $('.form-step.active').removeClass('active');
        $('.form-step[data-step="5"]').addClass('active');

        $('.form-controls').slideUp(300);

        setTimeout(function(){
            $('.step-names').fadeOut(300);
            $('.progress-bar').slideUp(300);
        }, 650);
    },

    binds: function(){
        $('#cc_type').on('change', function(){
            app.sections.company.typeSelect($(this));
        });

        $('.start-master').on('click', function(e){
            app.sections.company.setStep(1);
        });
    },

    selectCaegory: function(name){
        $('.side-menu a, .form-hidden-section').removeClass('active');
        $('.side-menu a[data-name="' + name + '"], .form-hidden-section[data-name="' + name + '"]').addClass('active');
    },

    setStep: function(step){
        if(step < 0){
            step = 0;
        }

        if(step > this.steps){
            step = this.steps;
        }

        if(step == 'intro'){
            step = 0;
        }

        if(step == 'finish'){
            step = this.steps + 1;
        }

        if(step > 0){
            var width = (step / this.steps) * 100;

            $('.progress-bar div').css({
                width: width + '%'
            });

            if(step > 0 && step <= this.steps){
                $('.current_step').html(step);
                $('.total_step').html(this.steps);
            }
        }

        this.current_slide = step;

        if(step > this.steps){
            this.finish();
        }

        if(step == 1){
            this.start();
        }

        if(step == 0){
            this.intro();
        }

        var backstep = step - 1;

        if(backstep < 0){
            backstep = 0;
        }

        $('.prev-step').off('click').on('click', function(){
            app.sections.company.setStep(backstep);
        });

        this.setSlidePosition(step);

        if(this.form_controller){
            this.form_controller.dismissFormMessage();
        }
    },

    step1: function(){
        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/add/step1',
            show_success_message: false,
            fields: app.sections.company.fields.step1,
            messages: {
                CC_NAME_EMPTY: 'Наименование не заполнено',
                CC_INN_EMPTY: 'ИНН не заполнен',
                CC_KPP_EMPTY: 'КПП не заполнен',
                CC_OGRN_EMPTY: 'ОГРН не заполнен'
            },
            onSuccess: function(data){
                if(data.success == true){
                    $('.form-step.active').removeClass('active');
                    $('.form-step[data-step="2"]').addClass('active');

                    app.sections.company.step2();
                    app.sections.company.setStep(2);

                    $.extend(app.sections.company.form_data, data.send_data);
                }
            }
        });
    },

    step2: function(){
        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/add/step2',
            show_success_message: false,
            fields: app.sections.company.fields.step2,
            messages: {
                CC_CITY_EMPTY: 'Город не заполнен',
                CC_INDEX_EMPTY: 'Индекс не заполнен',
                CC_STREET_EMPTY: 'Улица заполнена',
                CC_HOUSE_EMPTY: 'Дом не заполнен'
            },
            onSuccess: function(data){
                if(data.success == true){
                    $('.form-step.active').removeClass('active');
                    $('.form-step[data-step="3"]').addClass('active');

                    app.sections.company.step3();
                    app.sections.company.setStep(3);

                    $.extend(app.sections.company.form_data, data.send_data);
                }
            }
        });
    },

    step3: function(){
        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/add/step3',
            show_success_message: false,
            fields: app.sections.company.fields.step3,
            messages: {

            },
            onSuccess: function(data){
                if(data.success == true){
                    $('.form-step.active').removeClass('active');
                    $('.form-step[data-step="4"]').addClass('active');

                    app.sections.company.step4();
                    app.sections.company.setStep(4);

                    $.extend(app.sections.company.form_data, data.send_data);
                }
            }
        });
    },

    step4: function(){
        $('.next-step').val('Завершить');

        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/add/step4',
            show_success_message: false,
            fields: app.sections.company.fields.step3,
            messages: {

            },
            onSuccess: function(data){
                if(data.success == true){
                    app.sections.company.setStep('finish');

                    if(app.sections.company.mode == 'edit'){
                        $('#global-company-type').html($('#cc_type option:selected').html());
                        $('#global-company-name').html($('#cc_name').val());
                    }
                }
            }
        });
    },

    setSlidePosition: function(pos){
        $('.slideable-container').css({
            marginLeft: -(pos * this.form_width)
        });

        $('.slideable-wrapper').css({
            height: $('.form-step[data-step="' + pos + '"]').height()
        });
    },

    init: function(mode){
        this.mode = mode;

        /*this.crop_controller = new app.crop.BasicCropController({
            form_controller: this.form_controller,
            selector: '.crop-upload'
        });*/

        $('.slideable-wrapper').css({
            height: $('.form-step[data-step="0"]').height()
        });

        $('.slideable-container').css({
            width: this.form_width * 6
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
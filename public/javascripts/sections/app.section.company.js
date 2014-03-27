app.sections.company = {
    form_width: 960,
    current_slide: 0,
    steps: 4,
    finished: false,
    started: false,

    mode: 'add',

    form_data: {
        form_mode: '',
        id: '',

        cc_type: '',
        cc_name: '',
        cc_inn: '',
        cc_kpp: '',
        cc_ogrn: '',
        cc_ceo_name: '',
        cc_ceo_type: '',
        cc_accountant_name: '',
        cc_accountant_type: '',

        cc_city: '',
        cc_index: '',
        cc_street: '',
        cc_house: '',

        bank_name: '',
        bank_bik: '',
        bank_pay_account: '',
        bank_corr_account: '',

        cc_phone: '',
        cc_fax: '',
        cc_email: '',
        cc_skype: '',
        cc_website: ''
    },

    fields: {
        step1: {
            cc_type: '#cc_type',
            cc_name: '#cc_name',
            cc_inn: '#cc_inn',
            cc_kpp: '#cc_kpp',
            cc_ogrn: '#cc_ogrn',

            cc_ceo_name: '#cc_ceo_name',
            cc_ceo_type: '#cc_ceo_type',
            cc_accountant_name: '#cc_accountant_name',
            cc_accountant_type: '#cc_accountant_type'
        },

        step2: {
            cc_city: '#cc_city',
            cc_index: '#cc_index',
            cc_street: '#cc_street',
            cc_house: '#cc_house'
        },

        step3: {
            bank_name: '#bank_name',
            bank_bik: '#bank_bik',
            bank_pay_account: '#bank_pay_account',
            bank_corr_account: '#bank_corr_account'
        },

        step4: {
            form_mode: '#form_mode',
            id: '#id',

            cc_phone: '#cc_phone',
            cc_fax: '#cc_fax',
            cc_email: '#cc_email',
            cc_skype: '#cc_skype',
            cc_website: '#cc_website'
        }
    },

    intro: function () {
        $('.step-names').fadeOut(300);
        $('.progress-bar').slideUp(300);
        $('.form-controls').slideUp(300);

        this.finished = false;
    },

    start: function () {
        $('#form-company').show();

        $('.form-step.active').removeClass('active');
        $('.form-step[data-step="1"]').addClass('active');

        setTimeout(function () {
            $('.step-names').fadeIn(300);
            $('.progress-bar').slideDown(300);
            $('.form-controls').slideDown(300);
        }, 650);

        this.step1();

        this.started = true;
    },

    finish: function () {
        $('.form-step.active').removeClass('active');
        $('.form-step[data-step="5"]').addClass('active');

        $('.form-controls').slideUp(300);

        setTimeout(function () {
            $('.step-names').fadeOut(300);
            $('.progress-bar').slideUp(300);
        }, 650);

        this.finished = true;
        this.started = false;
    },

    binds: function () {
        $('#cc_type').on('change', function () {
            if ($(this).val() == '4') {
                $('label[for=cc_ogrn]').text('ОГРНИП');
                $('#kpp-item').hide();
                $('#cc_ceo_type_block').hide();
                $('#cc_ceo_type').val('4').trigger("chosen:updated");

            } else {
                $('label[for=cc_ogrn]').text('ОГРН');
                $('#kpp-item').show();
                $('#cc_ceo_type_block').show();
                $('#cc_ceo_type').val('1').trigger("chosen:updated");
            }

            app.sections.company.setSlidePosition(app.sections.company.current_slide);
        });

        $('#cc_accountant_type').on('change', function () {
            if ($(this).val() == '1') {
                $('#cc_accountant_name_block').hide();
            } else {
                $('#cc_accountant_name_block').show();
            }

            app.sections.company.setSlidePosition(app.sections.company.current_slide);
        });

        $('.start-master').off('click').on('click', function (e) {
            app.sections.company.setStep(1);
            e.preventDefault();
        });

        $('.side-menu a.step').off('click').on('click', function(e){
            e.preventDefault();

            app.sections.company.switchStep($(this).data('step'));
        });

        $(window).on('load', function(){
            if(document.location.hash){
                app.sections.company.switchStep(document.location.hash.substr(1, document.location.hash.length));
            }
        });
    },

    switchStep: function(step){
        step = parseInt(step);

        switch(step){
            case 1 : {
                app.sections.company.step1();
                app.sections.company.setStep(1);
            } break;

            case 2 : {
                app.sections.company.step2();
                app.sections.company.setStep(2);
            } break;

            case 3 : {
                app.sections.company.step3();
                app.sections.company.setStep(3);
            } break;

            case 4 : {
                app.sections.company.step4();
                app.sections.company.setStep(4);
            } break;
        }

        if(this.finished === true || this.started !== true){
            $('.step-names').fadeIn(300);
            $('.progress-bar').slideDown(300);
            $('.form-controls').slideDown(300);
        }
    },

    selectCaegory: function (name) {
        $('.side-menu a, .form-hidden-section').removeClass('active');
        $('.side-menu a[data-name="' + name + '"], .form-hidden-section[data-name="' + name + '"]').addClass('active');
    },

    setStep: function (step) {
        if (step < 0) {
            step = 0;
        }

        if (step > this.steps) {
            step = this.steps;
        }

        if (step == 'intro') {
            step = 0;
        }

        if (step == 'finish') {
            step = this.steps + 1;
        }

        if (step > 0) {
            var stepw = step - 1;

            var width = (stepw / this.steps) * 100;

            if (width > 100) {
                width = 100;
            }

            $('.progress-bar div').css({
                width: width + '%'
            });

            if (step > 0 && step <= this.steps) {
                $('.current_step').html(step);
                $('.total_step').html(this.steps);
            }
        }

        $('.side-menu a.step').removeClass('active');
        $('.side-menu a.step[data-step="' + step + '"]').addClass('active');

        this.current_slide = step;

        if (step > this.steps) {
            this.finish();
        }

        if (step == 1) {
            this.start();
        }

        if (step == 0) {
            this.intro();
        }

        var backstep = step - 1;

        if (backstep < 0) {
            backstep = 0;
        }

        $('.prev-step').off('click').on('click', function () {
            app.sections.company.setStep(backstep);
        });

        this.setSlidePosition(step);

        if (this.form_controller) {
            this.form_controller.dismissFormMessage();
        }
    },

    step1: function () {
        $('.next-step').val('Следующий шаг');

        setTimeout(function () {
            $('#cc_name').focus();
        }, 600);

        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/' + app.sections.company.mode + '/step1',
            show_success_message: false,
            fields: app.sections.company.fields.step1,
            messages: {
                CC_NAME_EMPTY: 'Наименование не заполнено',
                CC_INN_EMPTY: 'ИНН не заполнен',
                CC_KPP_EMPTY: 'КПП не заполнен',
                CC_OGRN_EMPTY: 'ОГРН не заполнен',
                CC_CEO_NAME_EMPTY: 'Имя руководителя не заполнено'
            },
            onFail: function(){
                $('.checklist .item[data-step="1"]').removeClass('active');
            },
            onSuccess: function (data) {
                if (data.success == true) {
                    $('.form-step.active').removeClass('active');
                    $('.form-step[data-step="2"]').addClass('active');

                    $('.checklist .item[data-step="1"]').addClass('active');

                    app.sections.company.step2();
                    app.sections.company.setStep(2);

                    $.extend(app.sections.company.form_data, data.send_data);
                }
            }
        });
    },

    step2: function () {
        $('.next-step').val('Следующий шаг');

        setTimeout(function () {
            $('#cc_city').focus();
        }, 600);

        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/' + app.sections.company.mode + '/step2',
            show_success_message: false,
            fields: app.sections.company.fields.step2,
            messages: {
                CC_CITY_EMPTY: 'Город не заполнен',
                CC_INDEX_EMPTY: 'Индекс не заполнен',
                CC_STREET_EMPTY: 'Улица заполнена',
                CC_HOUSE_EMPTY: 'Дом не заполнен'
            },
            onFail: function(){
                $('.checklist .item[data-step="2"]').removeClass('active');
            },
            onSuccess: function (data) {
                if (data.success == true) {
                    $('.form-step.active').removeClass('active');
                    $('.form-step[data-step="3"]').addClass('active');

                    app.sections.company.step3();
                    app.sections.company.setStep(3);

                    $('.checklist .item[data-step="2"]').addClass('active');

                    $.extend(app.sections.company.form_data, data.send_data);
                }
            }
        });
    },

    step3: function () {
        $('.next-step').val('Следующий шаг');

        setTimeout(function () {
            $('#bank_name').focus();
        }, 600);

        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/' + app.sections.company.mode + '/step3',
            show_success_message: false,
            fields: app.sections.company.fields.step3,
            messages: {

            },
            onFail: function(){
                $('.checklist .item[data-step="3"]').removeClass('active');
            },
            onSuccess: function (data) {
                if (data.success == true) {
                    $('.form-step.active').removeClass('active');
                    $('.form-step[data-step="4"]').addClass('active');

                    app.sections.company.step4();
                    app.sections.company.setStep(4);

                    $('.checklist .item[data-step="3"]').addClass('active');

                    $.extend(app.sections.company.form_data, data.send_data);
                }
            }
        });
    },

    step4: function () {
        setTimeout(function () {
            $('#cc_phone').focus();
        }, 600);

        if(this.mode == 'edit'){
            $('.next-step').val('Сохранить');
        }else{
            $('.next-step').val('Завершить');
        }

        this.form_controller = new app.form.FormController({
            form_selector: '#form-company',
            url: '/company/' + app.sections.company.mode + '/step4',
            show_success_message: false,
            fields: $.extend(
                app.sections.company.fields.step1,
                app.sections.company.fields.step2,
                app.sections.company.fields.step3,
                app.sections.company.fields.step4
            ),
            messages: {

            },
            onFail: function(){
                $('.checklist .item[data-step="4"]').removeClass('active');
            },
            onSuccess: function (data) {
                if (data.success == true) {
                    app.sections.company.finalSettings(data);
                    $('.checklist .item[data-step="4"]').addClass('active');
                }
            }
        });
    },

    finalSettings: function (data) {
        app.sections.company.setStep('finish');
        app.user.companies = data.data.companies;

        app.select_company_controller.renderSelector(
            app.utils.getCompanyTypeName(data.data.cc_type),
            data.data.cc_name
        );
    },

    setSlidePosition: function (pos) {
        $('.slideable-container').css({
            marginLeft: -(pos * this.form_width)
        });

        $('.slideable-wrapper').css({
            height: $('.form-step[data-step="' + pos + '"]').height()
        });
    },

    initStamp: function(){
        var crop_controller = new app.crop.BasicCropController({
            form_controller: this.form_controller,
            selector: '.crop-upload'
        });
    },

    init: function (mode, id) {
        this.mode = mode;
        this.id = id;

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
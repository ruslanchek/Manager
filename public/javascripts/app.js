var app = {
    kladr: {
        token: '5229b37e31608f6906000000',
        key: '1c7d3d5d80421d501145e9d2c946148c7e9965ca'
    },
    sections: {},
	chosen_options: {
		disable_search_threshold: 10,
		no_results_text: 'Не найдено',
		placeholder_text_multiple: 'Выбрать',
		placeholder_text_single: 'Выбрать',
		search_contains: true
	},
    user: {},

    tableSorting: function(){
        var table = $('.table-sort').stupidtable();

        table.bind('aftertablesort', function (event, data) {
            var th = $(this).find('th');
            th.find('.arrow').attr('class', 'arrow');

            var arrow = data.direction === 'asc' ? 'icon-up-dir' : 'icon-down-dir';

            th.eq(data.column).find('.arrow').addClass(arrow);
        });
    },

    maskedInput: function(){
        $('input[type="tel"]').mask("+9 (999) 999-99-99");
    },

	numeral: function(){
		numeral.language('ru', {
			delimiters: {
				thousands: ' ',
				decimal: ','
			},
			abbreviations: {
				thousand: 'тыс.',
				million: 'млн.',
				billion: 'млрд.',
				trillion: 'трлн.'
			},
			ordinal : function (number) {
				return number === 1 ? 'er' : 'ème';
			},
			currency: {
				symbol: 'руб.'
			}
		});

		numeral.language('ru');
	},

	chosen: function(){
		$('select').chosen(this.chosen_options);
	},

    noConfirmedEmail: function(){
        var sendCode = function(silent, f_controller, m_controller){
            $.ajax({
                url: '/auth/emailapprovementrequest',
                type: 'post',
                dataType: 'json',
                beforeSend: function(){
                    if(silent !== true){
                        m_controller.setLoading();
                    }
                },
                success: function(data){
                    if(silent !== true){
                        m_controller.unSetLoading();

                        if(data.success == true){
                            f_controller.pushFormMessage(true, 'Код выслан на ваш адрес');
                        }else{
                            var message = '';

                            if(data.message == 'JUST_RESTORED'){
                                message = 'Вы уже запрашивали код, попробуйте через 2 минуты'
                            }else{
                                message = 'Ошибка сервера';
                            }

                            f_controller.pushFormMessage(false, message);
                        }
                    }
                },
                error: function(){
                    if(silent !== true){
                        m_controller.unSetLoading();
                        f_controller.pushFormMessage(false, 'Ошибка передачи данных');
                    }
                }
            });
        };

        var notify_controller = new app.notify.NotifyController({
            icon: 'icon-mail',
            classname: 'yellow',
            content: 'Пожалуйста, подтвердите свой адрес электронной почты',
            onClick: function(n_controller){
                app.templates.render('email.approvement.html', { }, function(html){
                    var modal_controller = new app.modal.ModalController({
                        title: 'Подтверждение электронной почты',
                        content: html,
                        onShow: function(m_controller){
                            var f_controller = new app.form.FormController({
                                from_modal: true,
                                modal_controller: m_controller,
                                form_selector: '#form-email-approve',
                                url: '/auth/emailapprovement',
                                fields: { code: '#code' },
                                messages: {
                                    OK: 'Адрес подтвержден',
                                    CODE_WRONG: 'Введен неверный код',
                                    CODE_EMPTY: 'Не введен код'
                                },
                                onSuccess: function(data){
                                    setTimeout(function(){
                                        m_controller.close();
                                        n_controller.close();
                                    }, 350);
                                }
                            });

                            sendCode(true, f_controller, m_controller);

                            $('#resend-code').on('click', function(){
                                sendCode(false, f_controller, m_controller);
                            });
                        },
                        onClose: function(){

                        },
                        draggable: true,
                        width: 500
                    });

                    modal_controller.open();
                });
            }
        });

        setTimeout(function(){
            notify_controller.show();
        }, 1000);
    },

    noCompanies: function(){
        app.templates.render('common.no-companies.html', { }, function(html){
            var modal_controller = new app.modal.ModalController({
                title: 'Требуется настройка компании',
                content: html,
                onShow: function(m_controller){

                },
                onClose: function(){

                },
                draggable: false,
                closeable: false,
                width: 500
            });

            modal_controller.open();
        });
    },

    init: function(){
        this.maskedInput();
        this.tableSorting();
		this.numeral();
		this.chosen();

        this.select_company_controller = new app.company.CompanySelectController();

        if(this.user.approved_email !== true){
            this.noConfirmedEmail();
        }

        if(this.user.companies < 1 && document.location.pathname != '/company/add'){
            this.noCompanies();
        }
    }
};
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
        var notify_contrller = new app.notify.NotifyController({
            icon: 'icon-mail',
            classname: 'yellow',
            content: 'Пожалуйста, подтвердите свой адрес электронной почты',
            onClick: function(){
                app.templates.render('email.approve.html', { }, function(html){
                    var modal_controller = new app.modal.ModalController({
                        title: 'Подтверждение электронной почты',
                        content: html,
                        onShow: function(controller){

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
            notify_contrller.show();
        }, 1000);
    },

    init: function(){
        this.maskedInput();
        this.tableSorting();
		this.numeral();
		this.chosen();

        this.select_company_controller = new app.company.CompanySelectController({

        });

        if(this.user.approved_email !== true){
            this.noConfirmedEmail();
        }

        if(this.user.companies < 1){

        }
    }
};
var app = {
    company: {},

    kladr: {
        token: '5229b37e31608f6906000000',
        key: '1c7d3d5d80421d501145e9d2c946148c7e9965ca'
    },
    sections: {},

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

    getCompanyData: function(){
        return {
            cc_full_name: app.company.cc_type_name + ' &laquo;' + app.company.cc_name + '&raquo;',
            cc_inn: app.company.cc_inn,
            cc_kpp: app.company.cc_kpp,
            cc_is_ip: (app.company.cc_type == 4),
            bank_bik: app.company.bank_bik,
            bank_name: app.company.bank_name,
            bank_corr_account: app.company.bank_corr_account,
            bank_pay_account: app.company.bank_pay_account
        }
    },

    init: function(){
        this.tableSorting();

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
    }
};
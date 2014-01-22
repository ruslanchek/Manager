var app = {
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
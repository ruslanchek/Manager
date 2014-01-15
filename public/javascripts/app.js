var app = {
    sections: {},

    tableSorting: function(){
        var table = $('.table-sort').stupidtable();

        table.bind('aftertablesort', function (event, data) {
            var th = $(this).find('th');
            th.find('.arrow').remove();

            var arrow = data.direction === 'asc' ? 'icon-up-dir' : 'icon-down-dir';
            th.eq(data.column).append('<i class="arrow ' + arrow + '"></i>');
        });
    },

    maskedInput: function(){
        $('input[type="tel"]').mask("+9 (999) 999-99-99");
        $('input[data-metatype="date"]').mask("99-99-9999");
    },

    init: function(){
        this.tableSorting();
        this.maskedInput();
    }
};
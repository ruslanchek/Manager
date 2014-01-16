var app = {
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
    }
};
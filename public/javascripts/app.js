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

    init: function(){
        this.tableSorting();
    }
};
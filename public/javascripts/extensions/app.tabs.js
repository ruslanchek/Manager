app.tabs = {
    tabsController: function () {
        var _this = this;

        this.openTab = function (id) {
            $('.form-tabs nav a').removeClass('active');
            $('.form-tabs nav a[data-tab="' + id + '"]').addClass('active');

            $('.tab-content').hide();
            $('.tab-content[data-tab="' + id + '"]').show();
        };

        $('.form-tabs nav a').off('click').on('click', function (e) {
            e.preventDefault();

            _this.openTab($(this).data('tab'));
        });
    }
};
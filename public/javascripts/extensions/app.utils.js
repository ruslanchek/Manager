app.utils = {
    humanizeDate: function (date, output_with_time) {
        if (!date) {
            return '&mdash;';
        }

        if (!(Object.prototype.toString.call(date) === "[object Date]")) {
            var t = date.split(/[- :]/);

            date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        }

        var h_date,
            month_names = [
                'января',
                'февраля',
                'марта',
                'апреля',
                'мая',
                'июня',
                'июля',
                'августа',
                'сентября',
                'октября',
                'ноября',
                'декабря'
            ];

        var d = date.getDate(),
            M = date.getMonth(),
            Y = date.getFullYear();

        h_date = d + ' ' + month_names[M] + ', ' + Y;

        if (output_with_time === true) {
            var H = date.getHours(),
                i = date.getMinutes(),
                s = date.getSeconds();

            if (i < 10) {
                i = '0' + i;
            }

            if (s < 10) {
                s = '0' + s;
            }

            h_date = h_date + ', ' + H + ':' + i + ':' + s;
        }

        return h_date;
    }
}
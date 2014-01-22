var numeral = require('numeral');

numeral.language('ru', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'тыс.',
        million: 'млн.',
        billion: 'млрд.',
        trillion: 'трлд.'
    },
    currency: {
        symbol: 'руб.'
    }
});

numeral.language('ru');


/**
 * Humanize price
 * */
this.priceFormat = function (num) {
    return numeral(num).format('0,0.00');
};


/**
 * Date to humanized string
 * */
this.humanizeDate = function (date, output_with_time) {
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
};

/**
 * Merge two or more objects
 * */
this.extend = function (target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });

    return target;
};

/**
 * Translit str
 * */
this.translitStr = function (str){
    var tr = [
        ['А', 'a'],
        ['Б', 'b'],
        ['В', 'v'],
        ['Г', 'g'],
        ['Д', 'd'],
        ['Е', 'e'],
        ['Ё', 'e'],
        ['Ж', 'j'],
        ['З', 'z'],
        ['И', 'i'],
        ['Й', 'y'],
        ['К', 'k'],
        ['Л', 'l'],
        ['М', 'm'],
        ['Н', 'n'],
        ['О', 'o'],
        ['П', 'p'],
        ['Р', 'r'],
        ['С', 's'],
        ['Т', 't'],
        ['У', 'u'],
        ['Ф', 'f'],
        ['Х', 'h'],
        ['Ц', 'ts'],
        ['Ч', 'ch'],
        ['Ш', 'sh'],
        ['Щ', 'sch'],
        ['Ъ', ''],
        ['Ы', 'yi'],
        ['Ь', ''],
        ['Э', 'e'],
        ['Ю', 'yu'],
        ['Я', 'ya'],
        ['а', 'a'],
        ['б', 'b'],
        ['в', 'v'],
        ['г', 'g'],
        ['д', 'd'],
        ['е', 'e'],
        ['ё', 'e'],
        ['ж', 'j'],
        ['з', 'z'],
        ['и', 'i'],
        ['й', 'y'],
        ['к', 'k'],
        ['л', 'l'],
        ['м', 'm'],
        ['н', 'n'],
        ['о', 'o'],
        ['п', 'p'],
        ['р', 'r'],
        ['с', 's'],
        ['т', 't'],
        ['у', 'u'],
        ['ф', 'f'],
        ['х', 'h'],
        ['ц', 'ts'],
        ['ч', 'ch'],
        ['ш', 'sh'],
        ['щ', 'sch'],
        ['ъ', 'y'],
        ['ы', 'yi'],
        ['ь', ''],
        ['э', 'e'],
        ['ю', 'yu'],
        ['я', 'ya']
    ];

    for(var i = 0, l = tr.length; i < l; i++){
        var reg = new RegExp(tr[i][0], "g");

        str = str.replace(reg, tr[i][1]);
    }

    return str;
};


/**
 * Sanity from symbols
 * */
this.sanityStr = function (str){
    var reg = new RegExp('/[^a-zA-Z0-9-\?]/', "g");
    str = str.replace(reg, "-", str);

    var reg = new RegExp(' ', "g");
    str = str.replace(reg, "-", str);

    var reg = new RegExp('__', "g");
    str = str.replace(reg, "-", str);

    var reg = new RegExp('\\?', "g");
    str = str.replace(reg, "", str);

    str = str.toLowerCase();

    return this.translitStr(str);
};


/**
 * Find in object of array
 * */
this.findInObjOfArray = function(arr, key, val){
    if(arr && arr.length > 0 && key && val){
        for(var i = 0, l = arr.length; i < l; i++){
            if(arr[i][key] == val){
                return arr[i];
            }
        }
    }

    return false;
};


/**
 * Make Date object from pattern dd-mm-yyyy
 */
this.parseDate = function(str){
    var date = new Date();

    date.setDate(str.substr(0, 2));
    date.setMonth(parseInt(str.substr(3, 2)) - 1);
    date.setYear(str.substr(6, 4));
    date.setSeconds(0);
    date.setHours(0);
    date.setMinutes(0);

    return date;
};

/**
 * Make pattern dd-mm-yyyy from Date object
 */
this.stringifyDate = function(date){
    var m = parseInt(date.getMonth()) + 1,
        d = parseInt(date.getDate());

    if(m < 10){
        m = '0' + m.toString();
    }

    if(d < 10){
        d = '0' + d.toString();
    }

    return d + '.' + m + '.' + date.getFullYear();
};


/**
 * Test for regex pattern
 * */
this.matchPatternStr = function(str, type){
    var pattern = null;

    switch (type){
        case 'email' : {
            var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        } break;

        case 'username' : {
            var pattern = /^[a-zA-Z0-9-]{3,64}$/;
        } break;

        case 'name' : {
            var pattern = /^[a-zA-Z0-9А-Яа-я-]{3,64}$/;
        } break;

        case 'name_min' : {
            var pattern = /^[a-zA-Z0-9А-Яа-я-]{1,64}$/;
        } break;

        case 'password' : {
            var pattern = /^[a-zA-Z0-9-]{3,32}$/;
        } break;

        case 'md5' : {
            var pattern = /^[a-zA-Z0-9]{32}$/;
        } break;

        case 'date' : {
            var pattern = /^((((0[1-9]|[12][0-8])\.(0[1-9]|1[012]))|((29|30|31)\.(0[13578]|1[02]))|((29|30)\.(0[4,6,9]|11)))\.(19|[2-9][0-9])\d\d$)|(^29-02-(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))$/;
        }
    }

    if(pattern){
        return pattern.test(str);
    }
};


/**
 * Get Company type by id
 * */
this.getCompanyTypeName = function(id){
    switch (parseInt(id)) {
        case 1 : { return 'ООО' } break;
        case 2 : { return 'ЗАО' } break;
        case 3 : { return 'ОАО' } break;
        case 4 : { return 'ИП' } break;
        case 5 : { return 'ГУП' } break;
        case 6 : { return 'МУП' } break;
        case 7 : { return 'НП' } break;
        case 8 : { return 'АНО' } break;
        default : { return 'Другое' } break;
    }
};


/**
 * Get Company type by id
 * */
this.getCEOType = function(id){
    switch (parseInt(id)) {
        case 1 : { return 'Директор' } break;
        case 2 : { return 'Генеральный директор' } break;
        case 3 : { return 'Председатель' } break;
        case 4 : { return 'Другое' } break;
        case 5 : { return 'Не подписывает' } break;
    }
};


/**
 * Get Accountant type by id
 * */
this.getAccountantType = function(id){
    switch (parseInt(id)) {
        case 1 : { return 'Главный бухгалтер' } break;
        case 2 : { return 'Бухгалтер' } break;
        case 3 : { return 'Другое' } break;
        case 4 : { return 'Не подписывает' } break;
    }
};
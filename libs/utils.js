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
}

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
    };

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
}


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
}


/**
 * Test for regex pattern
 * */
this.matchPatternStr = function(str, type){
    switch (type){
        case 'email' : {
            var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return pattern.test(str);
        } break;
    }
}
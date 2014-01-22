app.kladr_address = {
    token: '5229b37e31608f6906000000',
    key: '1c7d3d5d80421d501145e9d2c946148c7e9965ca',

    KladrAddressController: function(options){
        var _this = this;

        this.options = {
            city: null,
            street: null,
            house: null,
            index: null
        };

        $.extend(this.options, options);

        $(this.options.city).kladr({
            token: app.kladr.token,
            key: app.kladr.key,
            type: $.kladr.type.city,
            select: function(obj) {
                $(_this.options.street).kladr('parentType', $.kladr.type.city);
                $(_this.options.street).kladr('parentId', obj.id);

                $(_this.options.house).kladr('parentType', $.kladr.type.street);
                $(_this.options.house).kladr('parentId', obj.id);

                if(obj){
                    if(obj.zip) { $(_this.options.index).val(obj.zip); }
                    $(_this.options.city).val(obj.type + ' ' + obj.name);
                }
            }
        });

        $(this.options.street).kladr({
            token: app.kladr.token,
            key: app.kladr.key,
            type: $.kladr.type.street,
            parentType: $.kladr.type.city,
            select: function(obj) {
                $(_this.options.house).kladr('parentType', $.kladr.type.street);
                $(_this.options.house).kladr('parentId', obj.id);

                if(obj){
                    if(obj.zip) { $(_this.options.index).val(obj.zip); }
                    $(_this.options.street).val(obj.type + ' ' + obj.name);
                }
            }
        });

        $(this.options.house).kladr({
            token: app.kladr.token,
            key: app.kladr.key,
            type: $.kladr.type.building,
            parentType: $.kladr.type.street,
            select: function(obj) {
                if(obj){
                    if(obj.zip) { $(_this.options.index).val(obj.zip); }
                    $(_this.options.house).val(obj.type + ' ' + obj.name);
                }
            }
        });
    }
};
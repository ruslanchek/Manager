module.exports = function (app, models) {
    this.checkStep1 = function(data, done){
        if(!data.cc_name){
            return done({
                success: false,
                message: 'CC_NAME_EMPTY',
                fields: ['cc_name']
            });
        }

        if(!data.cc_inn){
            return done({
                success: false,
                message: 'CC_INN_EMPTY',
                fields: ['cc_inn']
            });
        }

        if(!data.cc_kpp && data.cc_type != '4'){
            return done({
                success: false,
                message: 'CC_KPP_EMPTY',
                fields: ['cc_kpp']
            });
        }

        if(!data.cc_ogrn){
            return done({
                success: false,
                message: 'CC_OGRN_EMPTY',
                fields: ['cc_ogrn']
            });
        }

        return done({
            success: true
        });
    };

    this.checkStep2 = function(data, done){
        if(!data.cc_city){
            return done({
                success: false,
                message: 'CC_CITY_EMPTY',
                fields: ['cc_city']
            });
        }

        if(!data.cc_index){
            return done({
                success: false,
                message: 'CC_INDEX_EMPTY',
                fields: ['cc_index']
            });
        }

        if(!data.cc_street){
            return done({
                success: false,
                message: 'CC_STREET_EMPTY',
                fields: ['cc_street']
            });
        }

        if(!data.cc_house){
            return done({
                success: false,
                message: 'CC_HOUSE_EMPTY',
                fields: ['cc_house']
            });
        }

        return done({
            success: true
        });
    };

    this.checkStep3 = function(data, done){

        return done({
            success: true
        });
    };
};
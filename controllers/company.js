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
        if(!data.bank_name){
            return done({
                success: false,
                message: 'BANK_CORR_ACCOUNT_EMPTY',
                fields: ['bank_name']
            });
        }

        if(!data.bank_bik){
            return done({
                success: false,
                message: 'BANK_BIK_EMPTY',
                fields: ['bank_bik']
            });
        }

        if(!data.bank_pay_account){
            return done({
                success: false,
                message: 'BANK_PAY_ACCOUNT_EMPTY',
                fields: ['bank_pay_account']
            });
        }

        if(!data.bank_corr_account){
            return done({
                success: false,
                message: 'BANK_CORR_ACCOUNT_EMPTY',
                fields: ['bank_corr_account']
            });
        }

        return done({
            success: true
        });
    };

    this.checkStep4 = function(req, done){
        var data = req.body,
            user = req.user,
            session = req.session;

        if(data._id){
            data._id = user._id;
            data.current_company = 1;
        }

        // Сделать тут проверку данных, затем создание компании, получение ее ID и запись всего этого юзеру и сессии

        models.user.findOne({ _id: user._id }, function (err, user) {
            if (err) {
                app.log.error('findOneAndUpdate error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if(session && session.passport && session.passport.user){
                Object.keys(data).forEach(function(key) {
                    if(user[key] && key !== '_id'){
                        session.passport.user[key] = data[key];
                        user[key] = data[key];
                    }
                });

                session.save();

                user.save(function (err, user) {
                    if (err) {
                        app.log.error('User save error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    return done({
                        success: true,
                        message: 'OK'
                    });
                });
            }
        });
    };
};
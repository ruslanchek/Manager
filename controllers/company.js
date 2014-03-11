module.exports = function (app, models) {
    _this = this;

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
        }

        if(data.form_mode == 'add'){
            _this.addItem(user, data, session, function(result){
                if(result.success == true){
                    _this.updateCurrentCompanyUserdata(user, result.data, session, function(data){
                        done(data);
                    });
                }else{
                    done(data);
                }
            });
        }else{
            _this.updateItem(user, data, session, function(result){
                if(result.success == true){
                    _this.updateCurrentCompanyUserdata(user, result.data, session, function(data){
                        done(data);
                    });
                }else{
                    done(data);
                }
            });
        }
    };

    this.updateCurrentCompanyUserdata = function(user, data, session, done){
        if(data._id){
            data._id = user._id;
        }

        models.user.findOne({ _id: user._id }, function (err, user) {
            if (err) {
                app.log.error('findOneAndUpdate error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if(session && session.passport && session.passport.user){

                user.current_company = data._id;

                user.cc_type = data.cc_type;
                user.cc_name = data.cc_name;
                user.cc_inn = data.cc_inn;
                user.cc_kpp = data.cc_ogrn;
                user.cc_ceo_name = data.cc_ceo_name;
                user.cc_ceo_type = data.cc_ceo_type;
                user.cc_accountant_name = data.cc_accountant_name;
                user.cc_accountant_type = data.cc_accountant_type;

                user.cc_city = data.cc_city;
                user.cc_index = data.cc_index;
                user.cc_street = data.cc_street;
                user.cc_house = data.cc_house;

                user.bank_name = data.bank_name;
                user.bank_bik = data.bank_bik;
                user.bank_pay_account = data.bank_pay_account;
                user.bank_corr_account = data.bank_corr_account;

                user.cc_phone = data.cc_phone;
                user.cc_fax = data.cc_fax;
                user.cc_email = data.cc_email;
                user.cc_skype = data.cc_skype;
                user.cc_website = data.cc_website;


                session.passport.user.current_company = data._id;

                session.passport.user.cc_type = data.cc_type;
                session.passport.user.cc_name = data.cc_name;
                session.passport.user.cc_inn = data.cc_inn;
                session.passport.user.cc_kpp = data.cc_ogrn;
                session.passport.user.cc_ceo_name = data.cc_ceo_name;
                session.passport.user.cc_ceo_type = data.cc_ceo_type;
                session.passport.user.cc_accountant_name = data.cc_accountant_name;
                session.passport.user.cc_accountant_type = data.cc_accountant_type;

                session.passport.user.cc_city = data.cc_city;
                session.passport.user.cc_index = data.cc_index;
                session.passport.user.cc_street = data.cc_street;
                session.passport.user.cc_house = data.cc_house;

                session.passport.user.bank_name = data.bank_name;
                session.passport.user.bank_bik = data.bank_bik;
                session.passport.user.bank_pay_account = data.bank_pay_account;
                session.passport.user.bank_corr_account = data.bank_corr_account;

                session.passport.user.cc_phone = data.cc_phone;
                session.passport.user.cc_fax = data.cc_fax;
                session.passport.user.cc_email = data.cc_email;
                session.passport.user.cc_skype = data.cc_skype;
                session.passport.user.cc_website = data.cc_website;

                _this.getCompaniesCount(user._id, function(err, count){
                    user.companies = count;
                    session.passport.user.companies = count;

                    if (err) {
                        app.log.error('User session save error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    session.save(function(err){
                        if (err) {
                            app.log.error('User session save error', err);

                            return done({
                                success: false,
                                message: 'SERVER_ERROR'
                            });
                        }

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
                                message: 'OK',
                                data: data
                            });
                        });
                    });
                });
            }
        });
    };

    this.addItem = function(user, data, session, done){
        var new_item = new models.company();

        new_item._user_id = user._id;

        new_item.cc_type = data.cc_type;
        new_item.cc_name = data.cc_name;
        new_item.cc_inn = data.cc_inn;
        new_item.cc_kpp = data.cc_kpp;
        new_item.cc_ogrn = data.cc_ogrn;
        new_item.cc_ceo_name = data.cc_ceo_name;
        new_item.cc_ceo_type = data.cc_ceo_type;
        new_item.cc_accountant_name = data.cc_accountant_name;
        new_item.cc_accountant_type = data.cc_accountant_type;

        new_item.cc_city = data.cc_city;
        new_item.cc_index = data.cc_index;
        new_item.cc_street = data.cc_street;
        new_item.cc_house = data.cc_house;

        new_item.bank_name = data.bank_name;
        new_item.bank_bik = data.bank_bik;
        new_item.bank_pay_account = data.bank_pay_account;
        new_item.bank_corr_account = data.bank_corr_account;

        new_item.cc_phone = data.cc_phone;
        new_item.cc_fax = data.cc_fax;
        new_item.cc_email = data.cc_email;
        new_item.cc_skype = data.cc_skype;
        new_item.cc_website = data.cc_website;

        new_item.save(function (err, company_data) {
            if (err) {
                app.log.error('Company create error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            return done({
                success: true,
                message: 'OK',
                data: company_data
            });
        });
    };

    this.updateItem = function(user, data, session, done){
        models.company.findOne({ _user_id: user._id, _id: data.id }, function (err, item) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            item.cc_type = data.cc_type;
            item.cc_name = data.cc_name;
            item.cc_inn = data.cc_inn;
            item.cc_kpp = data.cc_kpp;
            item.cc_ogrn = data.cc_ogrn;
            item.cc_ceo_name = data.cc_ceo_name;
            item.cc_ceo_type = data.cc_ceo_type;
            item.cc_accountant_name = data.cc_accountant_name;
            item.cc_accountant_type = data.cc_accountant_type;

            item.cc_city = data.cc_city;
            item.cc_index = data.cc_index;
            item.cc_street = data.cc_street;
            item.cc_house = data.cc_house;

            item.bank_name = data.bank_name;
            item.bank_bik = data.bank_bik;
            item.bank_pay_account = data.bank_pay_account;
            item.bank_corr_account = data.bank_corr_account;

            item.cc_phone = data.cc_phone;
            item.cc_fax = data.cc_fax;
            item.cc_email = data.cc_email;
            item.cc_skype = data.cc_skype;
            item.cc_website = data.cc_website;

            item.save(function (err, company_data) {
                if (err) {
                    app.log.error('Account edit error', err);

                    return done({
                        success: false,
                        message: 'SERVER_ERROR'
                    });
                }

                return done({
                    success: true,
                    message: 'OK',
                    data: company_data
                });
            });
        });
    };

    this.findOne = function (user, id, done) {
        models.company.find({ _user_id: user._id, _id: id }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data[0]) {
                return done(false, data[0]);
            }else{
                return done(true);
            }
        });
    };

    this.getCompaniesCount = function(user_id, done){
        models.company.find({ _user_id: user_id }).count(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err, false);
            }

            if (data > 0 || data === 0) {
                return done(false, data);
            }

            return done(false, false);
        });
    };
};
module.exports = function (app, models) {
    var _this = this;

    this.checkStep1 = function (data, done) {
        if (!data.cc_name) {
            return done({
                success: false,
                message: 'CC_NAME_EMPTY',
                fields: ['cc_name']
            });
        }

        if (!data.cc_inn) {
            return done({
                success: false,
                message: 'CC_INN_EMPTY',
                fields: ['cc_inn']
            });
        }

        if (!data.cc_kpp && data.cc_type != '4') {
            return done({
                success: false,
                message: 'CC_KPP_EMPTY',
                fields: ['cc_kpp']
            });
        }

        if (!data.cc_ogrn) {
            return done({
                success: false,
                message: 'CC_OGRN_EMPTY',
                fields: ['cc_ogrn']
            });
        }

        if (!data.cc_ceo_name) {
            return done({
                success: false,
                message: 'CC_CEO_NAME_EMPTY',
                fields: ['cc_ceo_name']
            });
        }

        return done({
            success: true
        });
    };

    this.checkStep2 = function (data, done) {
        if (!data.cc_city) {
            return done({
                success: false,
                message: 'CC_CITY_EMPTY',
                fields: ['cc_city']
            });
        }

        if (!data.cc_index) {
            return done({
                success: false,
                message: 'CC_INDEX_EMPTY',
                fields: ['cc_index']
            });
        }

        if (!data.cc_street) {
            return done({
                success: false,
                message: 'CC_STREET_EMPTY',
                fields: ['cc_street']
            });
        }

        if (!data.cc_house) {
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

    this.checkStep3 = function (data, done) {
        if (!data.bank_name) {
            return done({
                success: false,
                message: 'BANK_NAME_EMPTY',
                fields: ['bank_name']
            });
        }

        if (!data.bank_bik) {
            return done({
                success: false,
                message: 'BANK_BIK_EMPTY',
                fields: ['bank_bik']
            });
        }

        if (!data.bank_pay_account) {
            return done({
                success: false,
                message: 'BANK_PAY_ACCOUNT_EMPTY',
                fields: ['bank_pay_account']
            });
        }

        if (!data.bank_corr_account) {
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

    this.checkStep4 = function (req, done) {
        var data = req.body,
            user = req.user,
            session = req.session;

        if (data._id) {
            data._id = user._id;
        }

        if (data.form_mode == 'add') {
            _this.addItem(user, data, session, function (result) {
                if (result.success == true) {
                    _this.updateCurrentCompanyUserdata(user, result.data, session, function (data) {
                        done(data);
                    });
                } else {
                    done(data);
                }
            });
        } else {
            _this.updateItem(user, data, session, function (result) {
                if (result.success == true) {
                    _this.updateCurrentCompanyUserdata(user, result.data, session, function (data) {
                        done(data);
                    });
                } else {
                    done(data);
                }
            });
        }
    };

    this.updateCurrentCompanyUserdata = function (user, data, session, done) {
        models.user.findOne({ _id: user._id }, function (err, user) {
            if (err) {
                app.log.error('findOneAndUpdate error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (session && session.passport && session.passport.user) {
                _this.setUserData(user, session, data);

                _this.getCompaniesCount(user._id, function (err, count) {
                    user.companies = count;
                    session.passport.user.companies = count;

                    if (err) {
                        app.log.error('User session save error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    session.save(function (err) {
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
                                data: user
                            });
                        });
                    });
                });
            } else {
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }
        });
    };

    this.addItem = function (user, data, session, done) {
        var new_item = new models.company();

        new_item._user_id = user._id;

        _this.setUserData(new_item, null, data);

        new_item.save(function (err, company_data) {
            if (err) {
                app.log.error('Company create error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            } else {
                return done({
                    success: true,
                    message: 'OK',
                    data: company_data
                });
            }
        });
    };

    this.updateItem = function (user, data, session, done) {
        models.company.findOne({ _user_id: user._id, _id: data.id }, function (err, item) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            _this.setUserData(item, null, data);

            item.save(function (err, company_data) {
                if (err) {
                    app.log.error('Account edit error', err);

                    return done({
                        success: false,
                        message: 'SERVER_ERROR'
                    });
                } else {
                    return done({
                        success: true,
                        message: 'OK',
                        data: company_data
                    });
                }
            });
        });
    };

    this.findOnePublic = function (id, done) {
        models.company.find({ _id: id }, { _user_id: 0 }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data[0]) {
                return done(false, data[0]);
            } else {
                return done(true);
            }
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
            } else {
                return done(true);
            }
        });
    };

    this.getCompaniesCount = function (user_id, done) {
        models.company.find({ _user_id: user_id }).count(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err, false);
            }

            if (data > 0 || data === 0) {
                return done(false, data);
            } else {
                return done(false, false);
            }
        });
    };

    this.getCompaniesList = function (user_id, done) {
        models.company.find({ _user_id: user_id }, { _id: 1, cc_name: 1, cc_type: 1 }).sort({ cc_name: 1 }).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (data) {
                return done({
                    success: true,
                    data: data,
                    message: 'OK'
                });
            } else {
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }
        });
    };

    this.nullUserData = function(user, session){
        var company_data = {};

        company_data._id = null;

        company_data.cc_type = null;
        company_data.cc_name = null;
        company_data.cc_inn = null;
        company_data.cc_kpp = null;
        company_data.cc_ogrn = null;
        company_data.cc_ceo_name = null;
        company_data.cc_ceo_type = null;
        company_data.cc_accountant_name = null;
        company_data.cc_accountant_type = null;

        company_data.cc_city = null;
        company_data.cc_index = null;
        company_data.cc_street = null;
        company_data.cc_house = null;

        company_data.bank_name = null;
        company_data.bank_bik = null;
        company_data.bank_pay_account = null;
        company_data.bank_corr_account = null;

        company_data.cc_phone = null;
        company_data.cc_fax = null;
        company_data.cc_email = null;
        company_data.cc_skype = null;
        company_data.cc_website = null;

        company_data.mc_account = null;
        
        this.setUserData(user, session, company_data);
    };

    this.setUserData = function(user_data, session, company_data){
        user_data.current_company = company_data._id;

        user_data.cc_type = company_data.cc_type;
        user_data.cc_name = company_data.cc_name;
        user_data.cc_inn = company_data.cc_inn;
        user_data.cc_kpp = company_data.cc_kpp;
        user_data.cc_ogrn = company_data.cc_ogrn;
        user_data.cc_ceo_name = company_data.cc_ceo_name;
        user_data.cc_ceo_type = company_data.cc_ceo_type;
        user_data.cc_accountant_name = company_data.cc_accountant_name;
        user_data.cc_accountant_type = company_data.cc_accountant_type;

        user_data.cc_city = company_data.cc_city;
        user_data.cc_index = company_data.cc_index;
        user_data.cc_street = company_data.cc_street;
        user_data.cc_house = company_data.cc_house;

        user_data.bank_name = company_data.bank_name;
        user_data.bank_bik = company_data.bank_bik;
        user_data.bank_pay_account = company_data.bank_pay_account;
        user_data.bank_corr_account = company_data.bank_corr_account;

        user_data.cc_phone = company_data.cc_phone;
        user_data.cc_fax = company_data.cc_fax;
        user_data.cc_email = company_data.cc_email;
        user_data.cc_skype = company_data.cc_skype;
        user_data.cc_website = company_data.cc_website;

        user_data.mc_account = company_data.mc_account;

        if(session){
            session.passport.user.current_company = company_data._id;

            session.passport.user.cc_type = company_data.cc_type;
            session.passport.user.cc_name = company_data.cc_name;
            session.passport.user.cc_inn = company_data.cc_inn;
            session.passport.user.cc_kpp = company_data.cc_kpp;
            session.passport.user.cc_ogrn = company_data.cc_ogrn;
            session.passport.user.cc_ceo_name = company_data.cc_ceo_name;
            session.passport.user.cc_ceo_type = company_data.cc_ceo_type;
            session.passport.user.cc_accountant_name = company_data.cc_accountant_name;
            session.passport.user.cc_accountant_type = company_data.cc_accountant_type;

            session.passport.user.cc_city = company_data.cc_city;
            session.passport.user.cc_index = company_data.cc_index;
            session.passport.user.cc_street = company_data.cc_street;
            session.passport.user.cc_house = company_data.cc_house;

            session.passport.user.bank_name = company_data.bank_name;
            session.passport.user.bank_bik = company_data.bank_bik;
            session.passport.user.bank_pay_account = company_data.bank_pay_account;
            session.passport.user.bank_corr_account = company_data.bank_corr_account;

            session.passport.user.cc_phone = company_data.cc_phone;
            session.passport.user.cc_fax = company_data.cc_fax;
            session.passport.user.cc_email = company_data.cc_email;
            session.passport.user.cc_skype = company_data.cc_skype;
            session.passport.user.cc_website = company_data.cc_website;

            session.passport.user.mc_account = company_data.mc_account;
            session.passport.user.mc_nomgroup = company_data.mc_nomgroup;
        }
    };

    this.selectCompany = function (req, done) {
        var data = req.body,
            user = req.user,
            session = req.session;

        models.company.findOne({ _user_id: user._id, _id: data.id }, function (err, company_data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (company_data) {
                models.user.findOne({ _id: user._id }, function (err, user_data) {

                    if (err) {
                        app.log.error('findOneAndUpdate error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    _this.setUserData(user_data, session, company_data);

                    session.save(function (err) {
                        if (err) {
                            app.log.error('User session save error', err);

                            return done({
                                success: false,
                                message: 'SERVER_ERROR'
                            });
                        }

                        user_data.save(function (err, user_data) {
                            if (err) {
                                app.log.error('Company create error', err);

                                return done({
                                    success: false,
                                    message: 'SERVER_ERROR'
                                });
                            } else {
                                return done({
                                    success: true,
                                    message: 'OK',
                                    data: user_data
                                });
                            }
                        });
                    });
                });
            } else {
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
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

    this.deleteCompany = function(req, done){
        var data = req.body,
            user = req.user,
            session = req.session;

        // Модели БД, которые будут очищены после удаления компании (все, что к ней относилось)
        var models_clear = [
            'account',
            'nomenclature',
            'nomgroup'
        ];

        models.company.findOneAndRemove({ _user_id: user._id, _id: data.id }, function(err){
            if (err) {
                app.log.error('findOneAndUpdate error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            var inits = 0,
                error = false;

            for(var i = 0, l = models_clear.length; i < l; i++){
                inits++;

                if(models[models_clear[i]]){
                    var model = models[models_clear[i]];

                    model.find({ _user_id: user._id, _company_id: data.id }, function(err, data){
                        if(err){
                            error = true;
                        }

                        if (data) {
                            for(var i = 0, l = data.length; i < l; i++){
                                data[i].remove();
                            }
                        }

                        inits--;
                    });
                }
            }

            inits++;

            _this.getCompaniesCount(user._id, function(err, count){
                inits--;

                if(err){
                    error = true;
                }

                if(count < 1){
                    inits++;

                    models.user.findOne({ _id: user._id }, function(err, user_data){
                        inits--;

                        if(err){
                            error = true;
                        }

                        _this.nullUserData(user_data, session);

                        user_data.companies = 0;
                        session.passport.user.companies = 0;

                        inits++;
                        user_data.save(function(err, data){
                            inits--;

                            if(err){
                                error = true;
                            }

                            inits++;
                            session.save(function(err){
                                inits--;

                                if(err){
                                    error = true;
                                }
                            });
                        });
                    });
                }
            });

            var inits_to = setInterval(function(){
                if(inits <= 0){
                    clearInterval(inits_to);

                    if(error === true){
                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }else{
                        return done({
                            success: true,
                            message: 'OK',
                            data: {
                                current_company: user.current_company
                            }
                        });
                    }
                }
            }, 20);
        });
    };

    this.uploadStamp = function(req, done){
        this.findOne(req.user, req.params.id, function(err, company_data){
            if(err || !company_data){
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            var path = '/user/' + req.user._id + '/company/' + company_data._id + '/';

            app.utils.uploadPicture({
                path: __dirname + '/../public/' + path,
                public_path: path,
                name: 'stamp',
                format: 'PNG',
                base64data: req.body.img_b64,
                done: function(result){
                    done(result);
                }
            });
        });
    };

    this.deleteStamp = function(req, done){
        this.findOne(req.user, req.params.id, function(err, company_data){
            if(err || !company_data){
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            app.utils.unlinkFile(__dirname + '/../public/user/' + req.user._id + '/company/' + company_data._id + '/stamp.png', function(result){
                return done(result);
            });
        });
    }
};
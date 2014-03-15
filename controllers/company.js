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
                message: 'BANK_CORR_ACCOUNT_EMPTY',
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

    this.setUserData = function(user_data, session, company_data){
        if(company_data._id) user_data.current_company = company_data._id;

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

        if(session){
            if(company_data._id) session.passport.user.current_company = company_data._id;

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
};
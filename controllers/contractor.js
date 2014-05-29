module.exports = function (app, models) {
    var _this = this;

    this.findItems = function (user, done) {
        models.contractor.find({ _user_id: user._id, _company_id: user.current_company }, { _id: 1, cc_name: 1, cc_type: 1, cc_email: 1, cc_phone: 1, cc_skype: 1 }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                done(false, data);
            }
        });
    };

    this.getList = function (user, done) {
        models.contractor.find({ _user_id: user._id, _company_id: user.current_company }, { _id: 1, cc_name: 1, cc_type: 1 }, function (err, data) {
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
                    data: data
                });
            }
        });
    };

    this.getItem = function(user, id, done) {
        models.contractor.findOne({ _user_id: user._id, _company_id: user.current_company, _id: id }, function (err, data) {
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
                    data: data
                });
            }
        });
    };

    this.findOne = function(user, id, done) {
        models.contractor.findOne({ _user_id: user._id, _company_id: user.current_company, _id: id }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                done(false, data);
            }
        });
    };

    this.validateInputs = function (data, part) {
        function part1(){
            if (!data.cc_name) {
                return {
                    success: false,
                    message: 'CC_NAME_EMPTY',
                    fields: ['cc_name']
                };
            }

            if (!data.cc_inn) {
                return {
                    success: false,
                    message: 'CC_INN_EMPTY',
                    fields: ['cc_inn']
                };
            }

            if (!data.cc_ogrn) {
                return {
                    success: false,
                    message: 'CC_OGRN_EMPTY',
                    fields: ['cc_ogrn']
                };
            }

            if (!data.cc_kpp && data.cc_type != '4') {
                return {
                    success: false,
                    message: 'CC_KPP_EMPTY',
                    fields: ['cc_kpp']
                };
            }

            return {
                success: true
            }
        }

        function part2(){
            if (!data.cc_ceo_name) {
                return {
                    success: false,
                    message: 'CC_CEO_NAME_EMPTY',
                    fields: ['cc_ceo_name']
                };
            }

            return {
                success: true
            }
        }

        function part3(){
            if (!data.bank_bik) {
                return {
                    success: false,
                    message: 'BANK_BIK_EMPTY',
                    fields: ['bank_bik']
                };
            }

            if (!data.bank_name) {
                return {
                    success: false,
                    message: 'BANK_NAME_EMPTY',
                    fields: ['bank_name']
                };
            }

            if (!data.bank_pay_account) {
                return {
                    success: false,
                    message: 'BANK_PAY_ACCOUNT_EMPTY',
                    fields: ['bank_pay_account']
                };
            }

            if (!data.bank_corr_account) {
                return {
                    success: false,
                    message: 'BANK_CORR_ACCOUNT_EMPTY',
                    fields: ['bank_corr_account']
                };
            }

            return {
                success: true
            }
        }

        function part4(){
            if (!data.cc_city) {
                return {
                    success: false,
                    message: 'CC_CITY_EMPTY',
                    fields: ['cc_city']
                };
            }

            if (!data.cc_street) {
                return {
                    success: false,
                    message: 'CC_STREET_EMPTY',
                    fields: ['cc_street']
                };
            }

            if (!data.cc_house) {
                return {
                    success: false,
                    message: 'CC_HOUSE_EMPTY',
                    fields: ['cc_house']
                };
            }

            if (!data.cc_index) {
                return {
                    success: false,
                    message: 'CC_INDEX_EMPTY',
                    fields: ['cc_index']
                };
            }

            return {
                success: true
            }
        }

        switch(part){
            case 1 : {
                return part1();
            } break;

            case 2 : {
                return part2();
            } break;

            case 3 : {
                return part3();
            } break;

            case 4 : {
                return part4();
            } break;

            default : {
                var p1 = part1(),
                    p2 = part2(),
                    p3 = part3(),
                    p4 = part4();

                if(!p1.success){
                    return p1;
                }

                if(!p2.success){
                    return p2;
                }

                if(!p3.success){
                    return p3;
                }

                if(!p4.success){
                    return p4;
                }
            }
        }
    };

    this.editItem = function(user, id, data, done){
        models.contractor.findOne({
            _user_id: user._id,
            _company_id: user.current_company,
            cc_name: data.cc_name,
            cc_type: data.cc_type,
            _id: { $ne: id }
        }, function (err, item) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (item) {
                return done({
                    success: false,
                    message: 'DUBLICATE_FOUND',
                    fields: ['cc_name']
                });
            }else{
                var validate = _this.validateInputs(data);

                if(validate.success !== true){
                    return done(validate);
                }

                models.contractor.findOne({ _user_id: user._id, _company_id: user.current_company, _id: id }, function (err, item) {
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

                    item.save(function (err, data) {
                        if (err) {
                            app.log.error('Contractor edit error', err);

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
            }
        });
    };

    this.addItem = function(user, id, data, done){
        models.contractor.findOne({
            _user_id: user._id,
            _company_id: user.current_company,
            cc_name: data.cc_name,
            cc_type: data.cc_type
        }, function (err, item) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (item) {
                return done({
                    success: false,
                    message: 'DUBLICATE_FOUND',
                    fields: ['cc_name']
                });
            }else {
                var validate = _this.validateInputs(data);

                if(validate.success !== true){
                    return done(validate);
                }

                var new_item = new models.contractor();

                new_item._user_id = user._id;
                new_item._company_id = user.current_company;

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

                new_item.save(function (err, data) {
                    if (err) {
                        app.log.error('Contractor add error', err);

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
            }
        });
    };

    this.deleteItems = function(user, ids, done){
        models.contractor.find({ _user_id: user._id, _company_id: user.current_company, _id: { $in: ids } }, { _id: 1 }).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (data) {
                for(var i = 0, l = data.length; i < l; i++){
                    data[i].remove();
                }

                return done({
                    success: true,
                    message: 'OK'
                });
            }

            return done({
                success: false,
                message: 'SERVER_ERROR'
            });
        });
    };
};
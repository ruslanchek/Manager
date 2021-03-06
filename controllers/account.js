 var fs = require('fs.extra');

module.exports = function(app, models) {
    var _this = this;

    this.findItems = function(user, filters, done) {
        var filters_query = {
            _user_id: user._id,
            _company_id: user.current_company
        };

        if (filters) {
            if (filters.date_from || filters.date_to) {
                filters_query.date = {};

                if (filters.date_from) {
                    var from = app.utils.parseDate(filters.date_from);

                    filters_query.date.$gte = new Date(from.getFullYear(), from.getMonth(), from.getDate());
                }

                if (filters.date_to) {
                    var to = app.utils.parseDate(filters.date_to);

                    to.setDate(to.getDate() + 1);

                    filters_query.date.$lt = new Date(to.getFullYear(), to.getMonth(), to.getDate());
                }
            }

            if (filters._id && filters._id.$in) {
                filters_query._id = filters._id;
            }
        }

        models.account
            .find(filters_query, {
                _id: 1,
                number: 1,
                date: 1,
                sum: 1,
                status: 1,
                count: 1,
                contractor: 1
            })
            .sort({
                date: -1,
                number: -1
            })
            .populate('contractor', 'cc_name cc_type')
            .exec(function(err, data) {
                if (err) {
                    app.log.error('find error', err);
                    return done(err);
                }

                if (data) {
                    data.sort(function(a, b) {
                        if (parseInt(a.number) < parseInt(b.number))
                            return 1;
                        if (parseInt(a.number) > parseInt(b.number))
                            return -1;
                        return 0;
                    });

                    return done(false, data);
                }

                return done(false, false);
            });
    };

    this.countAll = function(user, done) {
        models.account.count({
            _user_id: user._id,
            _company_id: user.current_company
        }, function(err, data) {
            if (err) {
                return done(data);
            }

            if (data) {
                return done(data);
            }

            return done(false);
        });
    };

    this.findOne = function(user, id, done) {
        models.account.find({
            _user_id: user._id,
            _company_id: user.current_company,
            _id: id
        }).populate('contractor').exec(function(err, data) {
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

    this.validateInputs = function(data) {
        if (!data.number || data.number == '') {
            return {
                success: false,
                message: 'NUMBER_EMPTY',
                fields: ['number']
            };
        }

        if (!app.utils.matchPatternStr(data.number, 'name_min')) {
            return {
                success: false,
                message: 'NUMBER_DOES_NOT_MATCH_PATTERN',
                fields: ['number']
            };
        }

        if (!data.date || data.date == '') {
            return {
                success: false,
                message: 'DATE_EMPTY',
                fields: ['date']
            };
        }

        if (!data.contractor || data.contractor == '') {
            return {
                success: false,
                message: 'CONTRACTOR_EMPTY',
                fields: ['contractor']
            };
        }

        if (!app.utils.matchPatternStr(data.date, 'date')) {
            return {
                success: false,
                message: 'DATE_DOES_NOT_MATCH_PATTERN',
                fields: ['date']
            };
        }

        if (data.items) {
            try {
                JSON.parse(decodeURIComponent(data.items));
            } catch (e) {
                return {
                    success: false,
                    message: 'SERVER_ERROR'
                };
            }
        }

        return true;
    };

    this.countNds = function(price, nds) {
        var price = parseFloat(price),
            nds = parseFloat(nds),
            nds_converted = (price / 100) * ((nds > 0) ? nds : 0);

        return parseFloat(price + nds_converted);
    };

    this.getValues = function(data) {
        var values = {
            items: [],
            count: 0,
            sum: 0,
            nds_sum: 0
        };

        try {
            values.items = JSON.parse(decodeURIComponent(data.items));
            values.sum = 0;
            values.nds_sum = 0;
            values.count = values.items.length;

            for (var i = 0; i < values.items.length; i++) {
                values.sum += this.countNds(values.items[i].price, values.items[i].nds) * parseInt(values.items[i].count);
                values.nds_sum += this.countNds(values.items[i].price, values.items[i].nds) * parseInt(values.items[i].count) - values.items[i].price * parseInt(values.items[i].count);
            }
        } catch (e) {

        }

        return values;
    };

    this.editItem = function(req, done) {
        var user = req.user,
            id = req.params.id,
            data = req.body,
            validate = this.validateInputs(data);

        if (validate !== true) {
            return done(validate);
        }

        var values = this.getValues(data);

        models.account.findOne({
            _user_id: user._id,
            _company_id: user.current_company,
            number: data.number,
            _id: {
                $ne: id
            }
        }, function(err, item) {
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
                    message: 'DUBLICATE_NUMBER_FOUND',
                    fields: ['number']
                });
            } else {
                models.account.findOne({
                    _user_id: user._id,
                    _company_id: user.current_company,
                    _id: id
                }, function(err, item) {
                    if (err) {
                        app.log.error('findOne error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    item.number = data.number;
                    item.date = app.utils.parseDate(data.date);
                    item.contractor = data.contractor;
                    item.comment = data.comment;
                    item.status = data.status;
                    item.items = values.items;
                    item.sum = values.sum;
                    item.nds = values.nds_sum;
                    item.count = values.count;

                    item.save(function(err, account_data) {
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
                            data: account_data
                        });
                    });
                });
            }
        });
    };

    this.addItem = function(user, data, req, done) {
        var validate = this.validateInputs(data);

        if (validate !== true) {
            return done(validate);
        }

        var values = this.getValues(data);

        models.account.findOne({
            _user_id: user._id,
            _company_id: user.current_company,
            number: data.number
        }, function(err, item) {
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
                    message: 'DUBLICATE_NUMBER_FOUND',
                    fields: ['number']
                });
            } else {
                var new_item = new models.account();

                new_item._user_id = user._id;
                new_item._company_id = user.current_company;
                new_item.number = data.number;
                new_item.date = app.utils.parseDate(data.date);
                new_item.contractor = data.contractor;
                new_item.comment = data.comment;
                new_item.status = data.status;
                new_item.items = values.items;
                new_item.sum = values.sum;
                new_item.nds = values.nds_sum;
                new_item.count = values.count;

                new_item.save(function(err, account_data) {
                    if (err) {
                        app.log.error('Account create error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    models.company.findOneAndUpdate({
                        _id: user.current_company
                    }, {
                        $inc: {
                            mc_account: 1
                        }
                    }, function(err, company_data) {
                        if (err) {
                            app.log.error('findOne error', err);

                            return done({
                                success: false,
                                message: 'SERVER_ERROR'
                            });
                        }

                        if (req.session && req.session.passport && req.session.passport.user) {
                            req.session.passport.user.mc_account = company_data.mc_account;
                            req.session.save();
                        }

                        return done({
                            success: true,
                            message: 'OK',
                            data: account_data
                        });
                    });
                });
            }
        });
    };

    this.deleteItems = function(user, ids, done) {
        models.account.find({
            _user_id: user._id,
            _company_id: user.current_company,
            _id: {
                $in: ids
            }
        }, {
            _id: 1
        }).exec(function(err, data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (data) {
                for (var i = 0, l = data.length; i < l; i++) {
                    app.utils.unlinkDir(__dirname + '/../public/user/' + user._id + '/company/' + user.current_company + '/document/account/' + data[i]._id, function (err) {
                        if (err) {
                            console.error(err); // TODO: Think about it
                        }
                    });

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

    this.send = function(req, done) {
        if (!req.body.email) {
            return done({
                success: false,
                message: 'EMAIL_EMPTY',
                fields: ['ie_email']
            });
        }

        if (!app.utils.matchPatternStr(req.body.email, 'email')) {
            return {
                success: false,
                message: 'EMAIL_WRONG',
                fields: ['ie_email']
            };
        }

        this.findOne(req.user, req.params.id, function(err, data) {
            if (err === true || !data) {
                return done({
                    success: false,
                    message: 'SERVER_ERROR',
                    code: '01'
                });
            } else {
                var url = app.config.get('protocol') + '://localhost:' + app.config.get('port') + '/accounts/render/' + data._id,
                    file_name = 'Счет №' + data.number + ' от ' + app.utils.humanizeDate(data.date);

                app.utils.generateDocument(url, req.cookies['connect.sid'], 'pdf', function(file_data) {
                    if (!file_data) {
                        return done({
                            success: false,
                            message: 'SERVER_ERROR',
                            code: '02'
                        });
                    }

                    // TODO: Create swith between PDF and Image

                    app.mailer.send({
                        template: 'mailer/common.senddoc.jade',
                        to: req.body.email,
                        subject: 'Account sended',
                        attachments: [{
                            fileName: file_name,
                            contents: file_data,
                            contentType: 'application/pdf'
                        }]
                    }, {
                        header: 'Вам счет',
                        message: 'Привет!!!'
                    }, function(err) {
                        if (err) {
                            app.log.error('Sending email error', err);

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
                });
            }
        });
    };

    this.createImage = function(doc_id, req, done){
        var url = app.config.get('protocol') + '://localhost:' + app.config.get('port') + '/accounts/render/' + doc_id,
            file_path = 'public/user/' + req.user._id + '/company/' + req.user.current_company + '/document/account/' + doc_id + '/';

        app.utils.generateDocumentImage(url, file_path, req.cookies['connect.sid'], function(files){
			if(!files){
				return done({
					status: false,
					message: 'CREATE_IMAGE_FAILED'
				});
			}else{
				return done({
					status: true,
					message: 'OK',
                    date: files
				});
			}
        });
    };

    return this;
};
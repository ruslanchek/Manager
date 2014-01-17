module.exports = function (app, models) {
    this.findItems = function (user, done) {
        models.account.find({ _user_id: user._id }, { _id: 1, number: 1, date: 1, sum: 1, status: 1 }).sort({date: -1}).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                done(false, data);
            }
        });
    };


    this.findOne = function (user, id, done) {
        models.account.find({ _user_id: user._id, _id: id }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data[0]) {
                done(false, data[0]);
            }else{
                return done(true);
            }
        });
    };

    this.validateInputs = function(data){
        if(!data.number || data.number == ''){
            return {
                success: false,
                message: 'NUMBER_EMPTY',
                fields: ['number']
            };
        }

        if (!app.utils.matchPatternStr(data.number, 'name')) {
            return {
                success: false,
                message: 'NUMBER_DOES_NOT_MATCH_PATTERN',
                fields: ['number']
            };
        }

        if(!data.date || data.date == ''){
            return {
                success: false,
                message: 'DATE_EMPTY',
                fields: ['date']
            };
        }

        if (!app.utils.matchPatternStr(data.date, 'date')) {
            return {
                success: false,
                message: 'DATE_DOES_NOT_MATCH_PATTERN',
                fields: ['date']
            };
        }

        return true;
    };

    this.editItem = function(user, id, data, done){
        var validate = this.validateInputs(data);

        if(this.validateInputs(data) !== true){
            return done(validate);
        }

        models.account.findOne({ _user_id: user._id, number: data.number, _id: { $ne: id } }, function (err, item) {
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
            }else{
                models.account.findOne({ _user_id: user._id, _id: id }, function (err, item) {
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
                    item.company = data.company;
                    item.comment = data.comment;
                    item.status = data.status;

                    item.save(function (err, data) {
                        if (err) {
                            app.log.error('Account create error', err);

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

    this.addItem = function(user, data, done){
        var validate = this.validateInputs(data);

        if(this.validateInputs(data) !== true){
            return done(validate);
        }

        models.account.findOne({ _user_id: user._id, number: data.number }, function (err, item) {
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
            }else{
                var new_item = new models.account();

                new_item._user_id = user._id;
                new_item.number = data.number;
                new_item.date = app.utils.parseDate(data.date);;
                new_item.contractor = data.contractor;
                new_item.company = data.company;
                new_item.comment = data.comment;
                new_item.status = data.status;

                new_item.save(function (err, data) {
                    if (err) {
                        app.log.error('Account create error', err);

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
        models.account.find({ _user_id: user._id, _id: { $in: ids } }, { _id: 1 }).exec(function (err, data) {
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
        });
    };

    return this;
};
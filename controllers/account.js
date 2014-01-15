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
    }

    this.findOne = function (user, id, done) {
        models.account.find({ _user_id: user._id, _id: id }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data[0]) {
                done(false, data[0]);
            }
        });
    }

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

        return true;
    }

    this.editItem = this.addItem = function(user, id, data, done){
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
    }

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
                var new_item = new models.account({
                    _user_id: user._id,
                    number: data.number
                });

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
    }

    return this;
};
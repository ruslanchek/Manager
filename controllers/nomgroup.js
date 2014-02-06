module.exports = function (app, models) {
    this.findItems = function (user, done) {
        models.nomgroup.find({ _user_id: user._id }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                return done(false, data);
            }

            return done(false, false);
        });
    };

    this.findOne = function (user, id, done) {
        models.nomgroup.find({ _user_id: user._id, _id: id }, function (err, data) {
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

    this.addItem = function(user, data, done){
        console.log(data)

        if (!data.name) {
            return done({
                success: false,
                message: 'NAME_EMPTY',
                fields: ['name']
            });
        }

        if (!app.utils.matchPatternStr(data.name, 'name')) {
            return done({
                success: false,
                message: 'NAME_DOES_NOT_MATCH_PATTERN',
                fields: ['name']
            });
        }

        models.nomgroup.findOne({ _user_id: user._id, name: data.name }, function (err, item) {
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
                    message: 'DUBLICATE_NAME_FOUND',
                    fields: ['name']
                });
            }else{
                var new_item = new models.nomgroup();

                new_item._user_id = user._id;
                new_item.name = data.name;

                new_item.save(function (err, data) {
                    if (err) {
                        app.log.error('Nomgroup create error', err);

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
};
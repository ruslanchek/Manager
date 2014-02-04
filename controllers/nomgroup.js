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
};
module.exports = function (app, models) {
    this.findItems = function (user, done) {
        models.account.find({ _user_id: user._id }, { _id: 1, article: 1, price: 1, name: 1 }).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
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

    return this;
};
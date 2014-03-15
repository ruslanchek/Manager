module.exports = function (app, models) {
    this.findItems = function (user, done) {
        models.account.find({ _user_id: user._id, _company_id: user.current_company }, { _id: 1, name: 1 }).sort({date: -1}).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                done(false, data);
            }
        });
    };
}
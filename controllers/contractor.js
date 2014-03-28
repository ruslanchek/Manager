module.exports = function (app, models) {
    this.findItems = function (user, done) {
        var contr = new models.contractor();

        contr._company_id = user.current_company;
        contr._user_id = user._id;
        contr.cc_name = 'asdasd';
        contr.cc_type = '1';
        contr.save();

        console.log('xxx')

        models.contractor.find({ _user_id: user._id, _company_id: user.current_company }).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                done(false, data);
            }
        });
    };
};
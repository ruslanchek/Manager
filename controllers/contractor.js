module.exports = function (app, models) {
    this.findItems = function (user, done) {
        var contr = new models.contractor();

        contr._company_id = user.current_company;
        contr._user_id = user._id;
        contr.cc_name = 'asdasd';
        contr.cc_type = '1';
        contr.save();

        models.contractor.find({ _user_id: user._id, _company_id: user.current_company }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                done(false, data);
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
};
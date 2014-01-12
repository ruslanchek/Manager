module.exports = function (app, models) {
    this.findItems = function (user, done) {
        models.account.find({ _user_id: user._id }, function (err, data) {
            console.log(user)

            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                done(false, data);
            }
        });

        var new_item = new models.account({
            _user_id: user._id,
            name: 'xzxzx'
        });

        new_item.save();
    }

    this.addItem = function(id){
        var new_item = new models.account({
            _creator: id,
            name: 'xzxzx'
        });

        new_item.save();
    }

    return this;
};
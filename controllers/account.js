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
    }

    this.addItem = function(user, data, done){
        models.account.find({ _user_id: user._id }, function (err, item) {
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
                    message: 'COLLECTION_HAS_AN_ITEM_WITH_SAME_NAME'
                });
            }
        });

        var new_item = new models.account({
            _user_id: user._id,
            name: 'xzxzx'
        });

        new_item.save();
    }

    return this;
};
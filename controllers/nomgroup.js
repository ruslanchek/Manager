module.exports = function (app, models) {
    this.findItems = function (user, done) {
        models.nomgroup.find( { _user_id: user._id } ).sort( { order: 1 }).exec( function (err, data) {
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

    this.validateInputs = function(data){
        if (!data.name) {
            return {
                success: false,
                message: 'NAME_EMPTY',
                fields: ['name']
            };
        }

        if (!app.utils.matchPatternStr(data.name, 'name')) {
            return {
                success: false,
                message: 'NAME_DOES_NOT_MATCH_PATTERN',
                fields: ['name']
            };
        }

        return true;
    };

    this.editItem = function(user, id, data, done){
        var validate = this.validateInputs(data);

        if(validate !== true){
            return done(validate);
        }

        models.nomgroup.findOne({ _user_id: user._id, name: data.name, _id: { $ne: id } }, function (err, item) {
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
                models.nomgroup.findOne({ _user_id: user._id, _id: id }, function (err, item) {
                    if (err) {
                        app.log.error('findOne error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    item.name = data.name;

                    item.save(function (err, data) {
                        if (err) {
                            app.log.error('Nomgroup edit error', err);

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

    this.addItem = function(user, data, session, done){
        var validate = this.validateInputs(data);

        if(validate !== true){
            return done(validate);
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
                new_item.order = parseInt(user.mc_nomgroup) + 1;

                new_item.save(function (err, nomgroup_data) {
                    if (err) {
                        app.log.error('Nomgroup create error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    models.user.findOneAndUpdate({ _id: user._id }, { $inc: { mc_nomgroup: 1 } }, function(err, user_data){
                        if (err) {
                            app.log.error('findOne error', err);

                            return done({
                                success: false,
                                message: 'SERVER_ERROR'
                            });
                        }

                        if(session && session.passport && session.passport.user){
                            session.passport.user.mc_nomgroup = user_data.mc_nomgroup;
                            session.save();
                        }

                        return done({
                            success: true,
                            message: 'OK',
                            data: nomgroup_data
                        });
                    });
                });
            }
        });
    };

    this.deleteItems = function(user, ids, done){
        models.nomgroup.find({ _user_id: user._id, _id: { $in: ids } }, { _id: 1 }).exec(function (err, data) {
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

                models.nomenclature.find({ _user_id: user._id, _nomgroup_id: { $in: ids } }, { _id: 1, _nomgroup_id: 1 }, function(err, data){
                    if (err) {
                        app.log.error('findOne error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    if(data){
                        for(var i = 0, l = data.length; i < l; i++){
                            data[i]._nomgroup_id = null;
                            data[i].save();
                        }
                    }

                    return done({
                        success: true,
                        message: 'OK'
                    });
                });

                return done({
                    success: true,
                    message: 'OK'
                });
            }

            return done({
                success: false,
                message: 'SERVER_ERROR'
            });
        });
    };
};
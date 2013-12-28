var generatePassword = require('password-generator'),
    crypto = require('crypto');

module.exports = function (app, models) {
    this.findOrCreate = function (provider, profile, done) {
        if (!profile.id || (!profile.username && !profile.displayName)) {
            return done('NO_ID_RECEIVED');
        }

        if (!profile.username) {
            profile.username = profile.displayName;
        }

        var create_data = {
                display_name: profile.displayName,
                username: app.utils.sanityStr(profile.displayName.toLowerCase()) + '-' + provider,
                password: generatePassword(12, false)
            },
            conditions = {};

        create_data[provider + '_id'] = profile.id;
        conditions[provider + '_id'] = profile.id;

        models.user.findOne(conditions, function (err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                done(null, user);

            } else {
                var new_user = new models.user(create_data);

                models.user.find({ username: RegExp('^' + new_user.username + '.*$') }, function (err, users) {
                    if (users.length > 0) {
                        var username = new_user.username,
                            try_suffix = 1,
                            username_try = username + '-' + try_suffix.toString();

                        while (app.utils.findInObjOfArray(users, 'username', username_try) !== false) {
                            username_try = username + '-' + try_suffix.toString();
                            try_suffix++;
                        }

                        new_user.username = username_try;
                    }

                    new_user.save(function (err, user) {
                        if (err) {
                            return done(err);
                        }

                        done(null, user);

                        app.log.info('User created: ', user.username);
                    });
                });
            }
        });
    }

    this.findOne = function (username, password, done) {
        models.user.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user || !user.checkPassword(password)) {
                return done(null, false);
            }

            if (user) {
                done(null, user);
            }
        });
    }

    this.passwordRecovery = function (email, done) {
        if (!email) {
            return done({
                success: false,
                message: 'EMAIL_EMPTY'
            });
        } else {
            if (!app.utils.matchPatternStr(email, 'email')) {
                return done({
                    success: false,
                    message: 'EMAIL_DOES_NOT_MATCH_PATTERN'
                });
            }
        }

        models.user.findOne({ email: email }, function (err, user) {
            if (err) {
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (user) {
                var current_date = new Date(),
                    restore_hash = crypto.randomBytes(32).toString('hex');

                if((current_date - user.restore_date) / 1000 / 60 <= 1){
                    return done({
                        success: false,
                        message: 'JUST_RESTORED'
                    });
                }

                models.user.findOneAndUpdate({ _id: user._id }, { $set: { restore_date: new Date(), restore_hash: restore_hash }}, function(err, user){
                    if (err) {
                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    app.mailer.send('mailer/auth.password-recovery.jade', {
                        to: user.email,
                        subject: 'Password recovery',
                        username: user.username,
                        display_name: user.display_name,
                        restore_hash: restore_hash,
                        recovery_uri: app.get('project_uri') + '/auth/password-recovery/' + restore_hash
                    }, function (err) {
                        if (err) {
                            app.log.error('Sending email error', err);

                            return done({
                                success: false,
                                message: 'SERVER_ERROR'
                            });
                        }

                        return done({
                            success: true,
                            message: 'OK'
                        });
                    });
                });
            } else {
                return done({
                    success: false,
                    message: 'EMAIL_NOT_FOUND'
                });
            }
        });
    }


    this.passwordRecoveryCheckCode = function (hash, done) {
        models.user.findOne({ restore_hash: hash }, function(err, user){
            if (err) {
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (user) {
                var new_password = generatePassword(12, false);

                user.password = new_password;
                user.restore_date = new Date();
                user.restore_hash = '';

                user.save(function (err, user) {
                    if (err) {
                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    app.mailer.send('mailer/auth.password-recovery-new-password.jade', {
                        to: user.email,
                        subject: 'New password',
                        username: user.username,
                        display_name: user.display_name,
                        new_password: new_password
                    }, function (err) {
                        if (err) {
                            app.log.error('Sending email error', err);

                            return done({
                                success: false,
                                message: 'SERVER_ERROR'
                            });
                        }

                        return done({
                            success: true,
                            message: 'Your password has been reset successfully, check your e-mail!'
                        });
                    });
                });
            }else{
                return done({
                    success: false,
                    message: 'CODE_IS_WRONG'
                });
            }
        });
    }

    /*
     var user = new models.user({
     username: 'test',
     password: '123',
     email: 'ruslanchek@me.com'
     });

     user.save(function(err, user) {
     console.log(user)

     if (err) {
     console.log(err)

     return;
     }

     app.log.info('User created: ', user.username);
     });
*/     

    return this;
};


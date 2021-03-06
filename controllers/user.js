var generatePassword = require('password-generator'),
    crypto = require('crypto');

module.exports = function (app, models) {
    var _this = this;

    this.getCompaniesCount = function(user_id, done){
        models.company.find({ _user_id: user_id }).count(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err, false);
            }

            if (data > 0 || data === 0) {
                return done(false, data);
            }

            return done(false, false);
        });
    };

    this.findOrCreate = function(provider, profile, done) {
        if (!profile.id || (!profile.username && !profile.displayName)) {
            return done('NO_ID_RECEIVED');
        }

        if (!profile.username) {
            profile.username = profile.displayName;
        }

        var create_data = {
                display_name: profile.displayName,
                username: app.utils.sanityStr(profile.displayName.toLowerCase()) + '-' + provider,
                password: generatePassword(12, false, /\w/)
            },
            conditions = {};

        create_data[provider + '_id'] = profile.id;
        conditions[provider + '_id'] = profile.id;

        models.user.findOne(conditions, function (err, user) {
            if (err) {
                app.log.error('findOne error', err);

                return done(err);
            }

            if (user) {
                _this.getCompaniesCount(user._id, function(err, count){
                    if(err){
                        return done(err);
                    }

                    user.companies = count;

                    done(null, user);
                });

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
                            app.log.error('User save error', err);

                            return done(err);
                        }

                        done(null, user);

                        app.log.info('User created: ', user.username);
                    });
                });
            }
        });
    };

    this.setCounters = function(req, user, done){
        models.company.findOne({ _user_id: user._id, _id: user.current_company }, function (err, company_data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(false);
            }

            if(company_data) {
                req.session.passport.user.mc_account = company_data.mc_account;
                req.session.passport.user.mc_nomgroup = company_data.mc_nomgroup;

                req.session.save(function () {
                    return done(true);
                });
            }else{
                return done(true);
            }
        });
    };

    this.findOne = function(username, password, done) {
        if (!username || !app.utils.matchPatternStr(username, 'username')) {
            return done({
                success: false,
                message: 'CREDENTIALS_IS_WRONG'
            });
        }

        if (!password || !app.utils.matchPatternStr(password, 'password')) {
            return done({
                success: false,
                message: 'CREDENTIALS_IS_WRONG'
            });
        }

        models.user.findOne({ username: username }, function (err, user) {
            if (err) {
                app.log.error('findOne error', err);

                return done(err);
            }

            if (!user || !user.checkPassword(password)) {
                return done(null, false);
            }

            if (user) {
                _this.getCompaniesCount(user._id, function(err, count){
                    if(err){
                        return done(err);
                    }

                    user.companies = count;

                    done(null, user);
                });
            }
        });
    };

    this.passwordRecovery = function(email, done) {
        if (!email) {
            return done({
                success: false,
                message: 'EMAIL_EMPTY',
                fields: ['email']
            });
        } else {
            if (!app.utils.matchPatternStr(email, 'email')) {
                return done({
                    success: false,
                    message: 'EMAIL_DOES_NOT_MATCH_PATTERN',
                    fields: ['email']
                });
            }
        }

        models.user.findOne({ email: email }, function (err, user) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (user) {
                var current_date = new Date(),
                    restore_hash = crypto.randomBytes(16).toString('hex');

                if((current_date - user.restore_date) / 1000 / 60 <= 1){
                    return done({
                        success: false,
                        message: 'JUST_RESTORED'
                    });
                }

                models.user.findOneAndUpdate({ _id: user._id }, { $set: { restore_date: new Date(), restore_hash: restore_hash }}, function(err, user){
                    if (err) {
                        app.log.error('findOneAndUpdate error', err);

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
    };

    this.passwordRecoveryCheckCode = function(hash, done) {
        if (!hash || !app.utils.matchPatternStr(hash, 'md5')) {
            return done({
                success: false,
                message: 'CODE_DOES_NOT_MATCH_PATTERN'
            });
        }

        models.user.findOne({ restore_hash: hash }, function(err, user){
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (user) {
                var new_password = generatePassword(12, false, /\w/);

                user.password = new_password;
                user.restore_date = new Date();
                user.restore_hash = '';

                user.save(function (err, user) {
                    if (err) {
                        app.log.error('User save error', err);

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
                            message: 'OK'
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
    };

    this.signUp = function(email, username, password, done){
        if (!email) {
            return done({
                success: false,
                message: 'EMAIL_EMPTY',
                fields: ['email']
            });
        } else {
            if (!app.utils.matchPatternStr(email, 'email')) {
                return done({
                    success: false,
                    message: 'EMAIL_DOES_NOT_MATCH_PATTERN',
                    fields: ['email']
                });
            }
        }

        if (!username || !app.utils.matchPatternStr(username, 'username')) {
            return done({
                success: false,
                message: 'USERNAME_DOES_NOT_MATCH_PATTERN',
                fields: ['email']
            });
        }

        if (!username) {
            return done({
                success: false,
                message: 'USERNAME_EMPTY',
                fields: ['username']
            });
        } else {
            if (!app.utils.matchPatternStr(username, 'username')) {
                return done({
                    success: false,
                    message: 'USERNAME_DOES_NOT_MATCH_PATTERN',
                    fields: ['username']
                });
            }
        }

        if (!password) {
            return done({
                success: false,
                message: 'PASSWORD_EMPTY',
                fields: ['password']
            });
        } else {
            if (!app.utils.matchPatternStr(password, 'password')) {
                return done({
                    success: false,
                    message: 'PASSWORD_DOES_NOT_MATCH_PATTERN',
                    fields: ['password']
                });
            }
        }

        models.user.findOne({ $or: [ { email: email }, { username: username} ] }, function(err, user){
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (user) {
                if(email == user.email){
                    return done({
                        success: false,
                        message: 'EMAIL_USED',
                        fields: ['email']
                    });
                }

                if(username == user.username){
                    return done({
                        success: false,
                        message: 'USERNAME_USED',
                        fields: ['username']
                    });
                }
            } else {
                var new_user = new models.user({
                    email: email,
                    username: username,
                    password: password
                });

                new_user.save(function (err, user) {
                    if (err) {
                        app.log.error('User save error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    app.log.info('User created: ', user.username);

                    app.mailer.send('mailer/auth.sign-up.jade', {
                        to: user.email,
                        subject: 'New password',
                        email: user.email,
                        username: user.username,
                        password: password
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
            }
        });
    };

    this.generateApprovementCode = function(user, done){
        var code = app.utils.generateRandomCode(6);

        models.user.findOne({ _id: user._id }, function (err, user_data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if(user_data){
                var current_date = new Date();

                if((current_date - user_data.approved_email_date) / 1000 / 60 <= 1){
                    return done({
                        success: false,
                        message: 'JUST_RESTORED'
                    });
                }

                user_data.approved_email_date = new Date();
                user_data.approved_email_code = code;

                user_data.save(function(err, user_data){
                    if (err) {
                        app.log.error('User save error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    app.mailer.send('mailer/auth.email-approvement.jade', {
                        to: user.email,
                        subject: 'Email approvement',
                        username: user.username,
                        display_name: user.display_name,
                        code: code
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
            }else{
                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }
        });
    };

    this.checkApprovementCode = function(req, done){
        var data = req.body,
            user = req.user,
            session = req.session;

        if(!data.code){
            return done({
                success: false,
                message: 'CODE_EMPTY'
            });
        }

        models.user.findOne({ _id: user._id, approved_email_code: data.code }, function (err, user_data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if(user_data){
                user_data.approved_email = true;
                session.passport.user.approved_email = true;

                session.save(function(err){
                    if (err) {
                        app.log.error('Session save error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    user_data.save(function (err, user) {
                        if (err) {
                            app.log.error('User save error', err);

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

                    app.mailer.send('mailer/auth.email-approved.jade', {
                        to: user.email,
                        subject: 'Email approved',
                        username: user.username,
                        display_name: user.display_name
                    }, function (err) {

                    });
                });
            }else{
                return done({
                    success: false,
                    message: 'CODE_WRONG'
                });
            }
        });
    };

    return this;
};


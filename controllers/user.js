var generatePassword = require('password-generator');

module.exports = function(app, models){
    this.findOrCreate = function (provider, profile, done) {
        if (!profile.id || (!profile.username && !profile.displayName)) {
            return done('NO_ID_RECEIVED');
        }

        if (!profile.username) {
            profile.username = profile.displayName;
        }

        var create_data = {
                display_name    : profile.displayName,
                username        : app.utils.sanityStr(profile.displayName.toLowerCase()) + '-' + provider,
                password        : generatePassword(12, false)
            },
            conditions = {};

        create_data[provider + '_id'] = profile.id;
        conditions[provider + '_id'] = profile.id;

        models.user.findOne(conditions, function(err, user) {
            if (err) { return done(err); }

            if (user) {
                done(null, user);

            }else{
                var new_user = new models.user(create_data);

                models.user.find({ username: RegExp('^' + new_user.username + '.*$') }, function(err, users) {
                    if(users.length > 0){
                        var username = new_user.username,
                            try_suffix = 1,
                            username_try = username + '-' + try_suffix.toString();

                        while(app.utils.findInObjOfArray(users, 'username', username_try) !== false){
                            username_try = username + '-' + try_suffix.toString();
                            try_suffix++;
                        }

                        new_user.username = username_try;
                    }

                    new_user.save(function(err, user) {
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
        models.user.findOne({ username: username }, function(err, user) {
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


    /*
    var user = new models.user({
        username: 'test',
        password: '123',
        email: 'ruslanchek@yandex.ru'
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


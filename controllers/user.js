var generatePassword = require('password-generator');

module.exports = function(app, models){
    this.findOrCreate = function (provider, profile, done) {
        var conditions,
            create_data;

        if (!profile.id || !profile.displayName) { return done(err); }

        switch(provider){
            case 'facebook' : {
                conditions = { facebook_id: profile.id };
                create_data = { facebook_id: profile.id, displayName: profile.displayName, username: profile.username };
            } break;

            case 'twitter' : {
                conditions = { twitter_id: profile.id };
                create_data = { twitter_id: profile.id, displayName: profile.displayName, username: profile.username };
            } break;
        }

        models.user.findOne(conditions, null, null, function(err, user) {
            if (err) { return done(err); }

            if (user) {
                done(null, user);

            }else{
                var user = new models.user(
                    app.utils.extend(
                        {
                            password: generatePassword(12, false)
                        },
                        create_data
                    )
                );

                user.save(function(err, user) {
                    if (err) { return done(err); }
                    done(null, user);

                    app.log.info("User created: ", user.username);
                });
            }
        });
    }

    this.findOne = function (username, password, done) {
        models.user.findOne({username: username}, null, null, function(err, user) {
            if (err) { return done(err); }

            if (!user.checkPassword(password)) { return done(null, false); }

            if (user) {
                done(null, user);
            }
        });
    }

    return this;
};


/*
this.findOrCreate = function (provider, profile, done) {
    var conditions,
        create_data;

    if (!profile.id || !profile.displayName) { return done(err); }

    switch(provider){
        case 'facebook' : {
            conditions = { facebook_id: profile.id };
            create_data = { facebook_id: profile.id, displayName: profile.displayName, username: profile.username };
        } break;

        case 'twitter' : {
            conditions = { twitter_id: profile.id };
            create_data = { twitter_id: profile.id, displayName: profile.displayName, username: profile.username };
        } break;
    }

    UserModel.findOne(conditions, null, null, function(err, user) {
        if (err) { return done(err); }

        if (user) {
            done(null, user);

        }else{
            var user = new UserModel(
                utils.extend(
                    {
                        password: generatePassword(12, false)
                    },
                    create_data
                )
            );

            user.save(function(err, user) {
                if (err) { return done(err); }
                done(null, user);

                log.info("User created: ", user.username);
            });
        }
    });
}


this.findOne = function (username, password, done) {
    UserModel.findOne({username: username}, null, null, function(err, user) {
        if (err) { return done(err); }

        if (!user.checkPassword(password)) { return done(null, false); }

        if (user) {
            done(null, user);
        }
    });
}
*/


/*
if (err) { return done(err); }

if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
}

if (!user.validPassword(password)) {
    return done(null, false, { message: 'Incorrect password.' });
}

return done(null, user);
    */
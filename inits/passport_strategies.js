var FacebookStrategy    = require('passport-facebook').Strategy,
    TwitterStrategy     = require('passport-twitter').Strategy,
    LocalStrategy       = require('passport-local').Strategy;

module.exports = function(app, express){
    /**
     * Passport inits
     * */
    app.passport.serializeUser(function(user, done) {
        done(null, user);
    });

    app.passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });


    /**
     * Passport for Facebook init
     * */
    app.passport.use(
        new FacebookStrategy({
                clientID: app.config.get('oauth:facebook:clientID'),
                clientSecret: app.config.get('oauth:facebook:clientSecret'),
                callbackURL: app.config.get('oauth:site_uri') + "/auth/facebook/callback"
            },
            function (accessToken, refreshToken, profile, done) {
                Users.findOrCreate('facebook', profile, function (err, user) {
                    if (err) { return done(err); }

                    done(null, user);
                });
            }
        )
    );


    /**
     * Passport for Twitter init
     * */
    app.passport.use(
        new TwitterStrategy({
                consumerKey: app.config.get('oauth:twitter:consumerKey'),
                consumerSecret: app.config.get('oauth:twitter:consumerSecret'),
                callbackURL: app.config.get('oauth:site_uri') + "/auth/twitter/callback"
            },
            function(token, tokenSecret, profile, done) {
                Users.findOrCreate('twitter', profile, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    done(null, user);
                });
            }
        )
    );


    /**
     * Passport for Local auth
     * */
    app.passport.use(
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            function(username, password, done) {
                Users.findOne(username, password, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    done(null, user);
                });
            }
        )
    );
}
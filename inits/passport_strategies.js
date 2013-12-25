var config              = require('../libs/config'),
    passport            = require('passport'),
    FacebookStrategy    = require('passport-facebook').Strategy,
    TwitterStrategy     = require('passport-twitter').Strategy,
    LocalStrategy       = require('passport-local').Strategy;

module.exports = function(){
    /**
     * Passport inits
     * */
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });


    /**
     * Passport for Facebook init
     * */
    passport.use(
        new FacebookStrategy({
                clientID: config.get('oauth:facebook:clientID'),
                clientSecret: config.get('oauth:facebook:clientSecret'),
                callbackURL: config.get('oauth:site_uri') + "/auth/facebook/callback"
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
    passport.use(
        new TwitterStrategy({
                consumerKey: config.get('oauth:twitter:consumerKey'),
                consumerSecret: config.get('oauth:twitter:consumerSecret'),
                callbackURL: config.get('oauth:site_uri') + "/auth/twitter/callback"
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
    passport.use(
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
/**
 * Requires
 */
var config = require('./libs/config');
var log = require('./libs/log')(module);

var express = require('express');
var http = require('http');
var path = require('path');


/**
 * Modules
 */
var Users = require('./libs/modules/users');


/**
 * Passport inits
 * */
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


/**
 * App init
 * */
var app = express();


/**
 * Environment
 * */
app.set('port', process.env.PORT || config.get('port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Development
 * */
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


/**
 * Misc auth settings
 * */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}


/**
 * HTTP errors
 * */
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.render('httperror', { code: '404' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.render('httperror', { code: res.statusCode, message: err.message });
    return;
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
));


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
));


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
));


/**
 * Routes for Facebook auth
 * */
app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res){
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
    }
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
);


/**
 * Routes for Twitter auth
 * */
app.get('/auth/twitter',
    passport.authenticate('twitter'),
    function(req, res){
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
    }
);

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' })
);


/**
 * Get routes
 * */
app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


/**
 * Post routes
 * */
app.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
);


/**
 * Server
 * */
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
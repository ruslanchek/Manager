var passport = require('passport');

module.exports = function(){
    /**
     * Routes for Facebook auth
     * */
    this.get('/auth/facebook',
        passport.authenticate('facebook'),
        function(req, res){
            // The request will be redirected to Facebook for authentication, so this
            // function will not be called.
        }
    );

    this.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
    );


    /**
     * Routes for Twitter auth
     * */
    this.get('/auth/twitter',
        passport.authenticate('twitter'),
        function(req, res){
            // The request will be redirected to Facebook for authentication, so this
            // function will not be called.
        }
    );

    this.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' })
    );


    /**
     * Post for logging in
     * */
    this.post('/login',
        passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
    );


    /**
     * Route for logging out
     * */
    this.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}
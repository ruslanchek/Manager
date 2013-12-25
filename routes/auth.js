module.exports = function(app, express){
    /**
     * Routes for Facebook auth
     * */
    app.get('/auth/facebook',
        app.passport.authenticate('facebook'),
        function(req, res){
            // The request will be redirected to Facebook for authentication, so app
            // function will not be called.
        }
    );

    app.get('/auth/facebook/callback',
        app.passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
    );


    /**
     * Routes for Twitter auth
     * */
    app.get('/auth/twitter',
        app.passport.authenticate('twitter'),
        function(req, res){
            // The request will be redirected to Facebook for authentication, so app
            // function will not be called.
        }
    );

    app.get('/auth/twitter/callback',
        app.passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' })
    );


    /**
     * Post for logging in
     * */
    app.post('/login',
        app.passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
    );


    /**
     * Route for logging out
     * */
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}
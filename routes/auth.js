module.exports = function (app, controllers) {
    /**
     * Routes for Facebook auth
     * */
    app.get('/auth/facebook', app.passport.authenticate('facebook'));

    app.get(
        '/auth/facebook/callback',
        app.passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Twitter auth
     * */
    app.get('/auth/twitter', app.passport.authenticate('twitter'));

    app.get(
        '/auth/twitter/callback',
        app.passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Google auth
     * */
    app.get('/auth/google', app.passport.authenticate('google'));

    app.get(
        '/auth/google/return',
        app.passport.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Vk auth
     * */
    app.get('/auth/vkontakte', app.passport.authenticate('vkontakte'));

    app.get(
        '/auth/vkontakte/callback',
        app.passport.authenticate('vkontakte', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Yandex auth
     * */
    app.get('/auth/yandex', app.passport.authenticate('yandex'));

    app.get('/auth/yandex/callback',
        app.passport.authenticate('yandex', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Route for login page
     * */
    app.get('/auth/login', app.ensureNotAuthenticated, function(req, res){
        res.render('auth.login.jade');
    });


    /**
     * Post for logging in
     * */
    app.post('/auth/login', function (req, res) {
        app.passport.authenticate('local', function (err, user) {
            if (req.xhr) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'SERVER_ERROR'
                    });
                }

                if (!user) {
                    return res.json({
                        success: false,
                        message: 'INVALID_CREDENTIALS',
                        fields: ['username', 'password']
                    });
                }

                req.login(user, {}, function (err) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    return res.json({
                        success: true,
                        message: 'OK'
                    });
                });
            } else {
                if (err) {
                    return res.redirect('/auth/login');
                }

                if (!user) {
                    return res.redirect('/auth/login');
                }

                req.login(user, {}, function (err) {
                    if (err) {
                        return res.redirect('/auth/login');
                    }
                    return res.redirect('/');
                });
            }
        })(req, res);
    });


    /**
     * Route for password recovery page
     * */
    app.get('/auth/password-recovery', app.ensureNotAuthenticated, function(req, res){
        res.render('auth.password-recovery.jade');
    });


    /**
     * Route for password recovery code page
     * */
    app.get('/auth/password-recovery/:hash', app.ensureNotAuthenticated, function(req, res){
        controllers.user.passwordRecoveryCheckCode(req.params.hash, function(result){
            res.render('auth.password-recovery-code.jade', {result: result});
        });
    });


    /**
     * Post for password recovery
     * */
    app.post('/auth/password-recovery', function(req, res){
        controllers.user.passwordRecovery(req.body.email, function(result){
            res.json(result);
        });
    });


    /**
     * Route for sign up page
     * */
    app.get('/auth/sign-up', app.ensureNotAuthenticated, function(req, res){
        res.render('auth.sign-up.jade');
    });


    /**
     * Post for sign up
     * */
    app.post('/auth/sign-up', function (req, res) {
        controllers.user.signUp(req.body.email, req.body.username, req.body.password, function(result){
            res.json(result);
        });
    });


    /**
     * Route for logging out
     * */
    app.get('/auth/logout', function (req, res) {
        req.logout();

        if (req.xhr) {
            return res.json({
                success: true
            });
        }else{
            res.redirect('/');
        }
    });
}
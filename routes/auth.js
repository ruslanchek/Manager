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
     * Post for logging in
     * */
    app.post('/auth/login', function (req, res) {
        app.passport.authenticate('local', function (err, user) {
            if (req.xhr) {
                if (err) {
                    return res.json({
                        success: false
                    });
                }

                if (!user) {
                    return res.json({ success: false });
                }

                req.login(user, {}, function (err) {
                    if (err) {
                        return res.json({
                            success: false
                        });
                    }

                    return res.json({
                        success: true
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
     * Route for login page
     * */
    app.get('/auth/login', app.ensureNotAuthenticated, function(req, res){
        res.render('login');
    });


    /**
     * Route for register page
     * */
    app.get('/auth/register', app.ensureNotAuthenticated, function(req, res){
        res.render('register', { user: req.user });
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
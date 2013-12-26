module.exports = function(app, controllers){
    /**
     * Get routes
     * */
    app.get('/', app.ensureAuthenticated, function(req, res){
        res.render('index', { user: req.user });
    });

    app.get('/account', app.ensureAuthenticated, function(req, res){
        res.render('account', { user: req.user });
    });
};
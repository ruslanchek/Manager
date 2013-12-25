module.exports = function(app, controllers){
    /**
     * Get routes
     * */
    app.get('/', function(req, res){
        res.render('index', { user: req.user });
    });

    app.get('/account', app.ensureAuthenticated, function(req, res){
        res.render('account', { user: req.user });
    });

    app.get('/login', function(req, res){
        res.render('login', { user: req.user });
    });
};
module.exports = function(){
    /**
     * Get routes
     * */
    this.get('/', function(req, res){
        res.render('index', { user: req.user });
    });

    this.get('/account', this.ensureAuthenticated, function(req, res){
        res.render('account', { user: req.user });
    });

    this.get('/login', function(req, res){
        res.render('login', { user: req.user });
    });
};
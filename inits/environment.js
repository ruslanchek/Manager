var path = require('path');

module.exports = function(app, express){
    app.log.info('Current environment:', app.get('env'));

    /**
     * Environment
     * */
    app.set('port', process.env.PORT || app.config.get('port'));
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');

    /**
     * Development
     * */
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    /**
     * Misc auth settings
     * */
    app.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }
}
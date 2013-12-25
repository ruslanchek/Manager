var log         = require('../libs/log')(module),
    config      = require('../libs/config'),
    path        = require('path'),
    express     = require('express');

module.exports = function(){
    log.info('Current environment:', this.get('env'));

    /**
     * Environment
     * */
    this.set('port', process.env.PORT || config.get('port'));
    this.set('views', path.join(__dirname, '../views'));
    this.set('view engine', 'jade');

    /**
     * Development
     * */
    if ('development' == this.get('env')) {
        this.use(express.errorHandler());
    }

    /**
     * Misc auth settings
     * */
    this.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }
}
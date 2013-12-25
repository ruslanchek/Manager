var log         = require('../libs/log')(module),
    path        = require('path'),
    express     = require('express'),
    passport    = require('express');

module.exports = function(){
    this.use(express.favicon());
    this.use(express.logger('dev'));
    this.use(express.json());
    this.use(express.urlencoded());
    this.use(express.cookieParser());
    this.use(express.bodyParser());
    this.use(express.methodOverride());
    this.use(express.session({ secret: 'keyboard cat' }));

    //this.use(passport.initialize());
    this.use(passport.session());

    this.use(this.router);
    this.use(express.static(path.join(__dirname, '../public')));

    /**
     * HTTP errors
     * */
    this.use(function(req, res, next){
        res.status(404);
        log.debug('Not found URL: %s', req.url);
        res.render('httperror', { code: '404' });
        return;
    });

    this.use(function(err, req, res, next){
        res.status(err.status || 500);
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        res.render('httperror', { code: res.statusCode, message: err.message });
        return;
    });
}
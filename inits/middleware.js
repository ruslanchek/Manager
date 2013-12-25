var path = require('path');

module.exports = function(app, express){
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' }));

    app.use(app.passport.initialize());
    app.use(app.passport.session());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../public')));

    /**
     * HTTP errors
     * */
    app.use(function(req, res, next){
        res.status(404);
        app.log.debug('Not found URL: %s', req.url);
        res.render('httperror', { code: '404' });
        return;
    });

    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        app.log.error('Internal error(%d): %s', res.statusCode, err.message);
        res.render('httperror', { code: res.statusCode, message: err.message });
        return;
    });
}
/**
 * Requires
 */
var express = require('express'),
    http = require('http');

/**
 * App init
 * */
var app             = express(),
    models          = {},
    controllers     = {};


/**
 * Variables
 * */
app.passport        = require('passport');

app.config          = require('./libs/config');
app.log             = require('./libs/log')(module);
app.utils           = require('./libs/utils');
app.mongoose        = require('./libs/mongoose')(app);


/**
 * Models
 * */
models.user = require('./models/user')(app).model;


/**
 * Controllers
 * */
controllers.user = require('./controllers/user')(app, models);


/**
 * Inits
 * */
require('./inits/environment')(app, express);
require('./inits/middleware')(app, express);
require('./inits/passport_strategies')(app, express);


/**
 * Routes
 * */
require('./routes/common')(app, express);
require('./routes/auth')(app, express);


/**
 * Server
 * */
http.createServer(app).listen(app.get('port'), function () {
    app.log.info('Express server listening on port ' + app.get('port'));
});

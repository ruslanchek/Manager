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
models.account = require('./models/account')(app).model;
models.company = require('./models/company')(app).model;


/**
 * Controllers
 * */
var UserController = require('./controllers/user');
var AccountController = new require('./controllers/account');
var CompanyController = new require('./controllers/company');

controllers.user = new UserController(app, models);
controllers.account = new AccountController(app, models);
controllers.company = new CompanyController(app, models);


/**
 * Inits
 * */
require('./inits/environment')(app, express);
require('./inits/extensions')(app, express);
require('./inits/middleware')(app, express);
require('./inits/passport_strategies')(app, controllers);


/**
 * Routes
 * */
require('./routes/common')(app, controllers);
require('./routes/auth')(app, controllers);
require('./routes/accounts')(app, controllers);


/**
 * Server
 * */
http.createServer(app).listen(app.get('port'), function () {
    app.log.info('Express server listening on port ' + app.get('port'));
});

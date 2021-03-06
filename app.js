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
app.redis           = require('./libs/redis')(app);


/**
 * Models
 * */
models.user = require('./models/user')(app).model;
models.account = require('./models/account')(app).model;
models.contractor = require('./models/contractor')(app).model;
models.nomenclature = require('./models/nomenclature')(app).model;
models.nomgroup = require('./models/nomgroup')(app).model;
models.company = require('./models/company')(app).model;

/**
 * Controllers
 * */
var UserController = require('./controllers/user');
var AccountController = require('./controllers/account');
var ContractorController = require('./controllers/contractor');
var NomenclatureController = require('./controllers/nomenclature');
var NomgroupController = require('./controllers/nomgroup');
var CompanyController = require('./controllers/company');

controllers.user = new UserController(app, models);
controllers.account = new AccountController(app, models);
controllers.contractor = new ContractorController(app, models);
controllers.nomenclature = new NomenclatureController(app, models);
controllers.nomgroup = new NomgroupController(app, models);
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
require('./routes/nomenclature')(app, controllers);
require('./routes/settings')(app, controllers);
require('./routes/company')(app, controllers);
require('./routes/contractors')(app, controllers);

/**
 * Server
 * */
http.createServer(app).listen(app.get('port'), function () {
    app.log.info('Express server listening on port ' + app.get('port'));
});

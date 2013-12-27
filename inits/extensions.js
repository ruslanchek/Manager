var mailer = require('express-mailer');

module.exports = function(app, express){
    mailer.extend(app, {
        from: 'no-reply@manager.cartrek.ru',
        transportMethod: 'sendmail'
    });
};
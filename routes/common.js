var wkhtmltopdf = require('wkhtmltopdf'),
    fs = require('fs'),
    path = require('path');

module.exports = function(app, controllers){
    var common = {
        utils: app.utils
    };

    /**
     * Get routes
     * */
    app.get('/', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            section: 'main',
            metadata: {
                title: 'Менеджер'
            }
        });

        res.render('main', params);
    });

    app.get('/pdf', function(req, res){
        wkhtmltopdf('http://google.com/', { pageSize: 'letter' }).pipe(res);
        res.end();
    });
};
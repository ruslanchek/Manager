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


    /**
     * Get routes
     * */
    app.get('/pdf', app.ensureAuthenticated, function(req, res){
        app.utils.generatePDF('http://localhost:2000/accounts/view/52e513bd45cd750f48e09fb7', req.cookies['connect.sid'], res);
    });
};
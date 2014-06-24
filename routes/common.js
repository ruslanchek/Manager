module.exports = function(app, controllers){
    var common = {
        utils: app.utils
    };

    /**
     * Main bootstrap route
     * */
     app.get('/', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            section: 'main',
            metadata: {
                title: 'Менеджер'
            }
        });

        res.render('bootstrap', params);
    });



    // Deprecated
    app.post('/view', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            section: 'view',
            metadata: {
                title: 'View'
            }
        });

        res.render('view', params);
    });
};
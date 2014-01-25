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
        app.utils.generatePDF('ЛОлццуйлоыфв8фы97вфы8в79фы7в9фы87в9', res);
    });
};
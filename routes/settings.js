module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'settings'
    };

    app.get('/settings', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            metadata: {
                title: 'Настройка'
            }
        });

        res.render(
            'settings',
            params
        );
    });

    app.post('/settings/company', app.ensureAuthenticated, function(req, res){
        controllers.user.edit(req, function(result){
            res.json(result);
        });
    });
};
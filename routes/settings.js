module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'settings'
    };

    app.get('/settings', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user
        });

        res.render(
            'settings',
            params
        );
    });
}
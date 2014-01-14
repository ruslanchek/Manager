module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'accounts'
    };

    app.get('/accounts', app.ensureAuthenticated, function(req, res){
        controllers.account.findItems(req.user, function(err, data){
            var params = app.utils.extend(common, {
                err: err,
                data: data,
                user: req.user
            });

            res.render(
                'accounts',
                params
            );
        });
    });

    app.get('/accounts/add', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user
        });

        res.render(
            'accounts.add.jade',
            params
        );
    });

    app.get('/accounts/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.findOne(req.user, req.params.id, function(err, data){
            var params = app.utils.extend(common, {
                err: err,
                data: data,
                user: req.user
            });

            res.render(
                'accounts.edit.jade',
                params
            );
        });
    });

    app.post('/accounts/add', app.ensureAuthenticated, function(req, res){
        controllers.account.addItem(req.user, req.body, function(result){
            res.json(result);
        });
    });

    app.post('/accounts/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.editItem(req.user, req.params.id, req.body, function(result){
            res.json(result);
        });
    });
};
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
                user: req.user,
                metadata: {
                    title: 'Счета'
                }
            });

            res.render('accounts', params);
        });
    });

    app.get('/accounts/add', app.ensureAuthenticated, function(req, res){
        controllers.account.countAll(req.user, function(data){
            var params = app.utils.extend(common, {
                user: req.user,
                number: (data >= 0) ? data+1 : '',
                metadata: {
                    title: 'Новый счет'
                }
            });

            res.render('accounts.add.jade', params);
        });
    });

    app.post('/accounts/delete', app.ensureAuthenticated, function(req, res){
        controllers.account.deleteItems(req.user, req.body.ids, function(result){
            res.json(result);
        });
    });

    app.get('/accounts/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.findOne(req.user, req.params.id, function(err, data){
            if(err === true){
                res.redirect('/404');
            }else{
                var params = app.utils.extend(common, {
                    err : err,
                    data: data,
                    user: req.user,
                    metadata: {
                        title: 'Редактирование счета'
                    }
                });

                res.render('accounts.edit.jade', params);
            }
        });
    });

    app.get('/accounts/view/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.findOne(req.user, req.params.id, function(err, data){
            if(err === true){
                res.redirect('/404');
            }else{
                var params = app.utils.extend(common, {
                    err : err,
                    data: data,
                    user: req.user,
                    metadata: {
                        title: 'Просмотр счета'
                    }
                });

                res.render('accounts.view.jade', params);
            }
        });
    });

    app.post('/accounts/view', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            data: req.body,
            user: req.user,
            metadata: {
                title: 'Просмотр счета'
            }
        });

        params.data.date = app.utils.parseDate(params.data.date);
        params.data.items = JSON.parse(decodeURIComponent(params.data.items));

        res.render('accounts.view.jade', params);
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
module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'nomenclature'
    };

    app.get('/nomenclature', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.findItems(req.user, function(err, data){
            var params = app.utils.extend(common, {
                err: err,
                data: data,
                user: req.user,
                metadata: {
                    title: 'Номенклатура'
                }
            });

            res.render('nomenclature', params);
        });
    });

    app.get('/nomenclature/add', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.countAll(req.user, function(data){
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

    app.post('/nomenclature/delete', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.deleteItems(req.user, req.body.ids, function(result){
            res.json(result);
        });
    });

    app.get('/nomenclature/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.findOne(req.user, req.params.id, function(err, data){
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

    app.get('/nomenclature/view/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.findOne(req.user, req.params.id, function(err, data){
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

    app.get('/nomenclature/pdf/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.findOne(req.user, req.params.id, function(err, data){
            if(err === true){
                res.redirect('/404');
            }else{
                var url = app.config.get('protocol') + '://' + app.config.get('host') + ':' + app.config.get('port') + '/accounts/view/' + req.params.id,
                    name = 'Счет №' + data.number + ' от ' + app.utils.humanizeDate(data.date);

                app.utils.generatePDF(url, req.cookies['connect.sid'], res, name);
            }
        });
    });

    app.post('/nomenclature/view', app.ensureAuthenticated, function(req, res){
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

    app.post('/nomenclature/add', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.addItem(req.user, req.body, function(result){
            res.json(result);
        });
    });

    app.post('/nomenclature/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.editItem(req.user, req.params.id, req.body, function(result){
            res.json(result);
        });
    });
};
module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'contractors'
    };

    app.get('/contractors', app.ensureAuthenticated, function(req, res){
        controllers.contractor.findItems(req.user, function(err, data){
            var params = app.utils.extend(common, {
                err: err,
                data: data,
                user: req.user,
                metadata: {
                    title: 'Контрагенты'
                }
            });

            res.render('contractors', params);
        });
    });

    app.get('/contractors/add', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            metadata: {
                title: 'Новый контрагент'
            }
        });

        res.render(
            'contractors.add.jade',
            params
        );
    });

    app.get('/contractors/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.contractor.findOne(req.user, req.params.id, function(err, data){
            if(err === true || !data){
                res.redirect('/404');
            }else{
                var params = app.utils.extend(common, {
                    err : err,
                    data: data,
                    user: req.user,
                    metadata: {
                        title: 'Редактирование контрагента'
                    }
                });

                res.render(
                    'contractors.edit.jade',
                    params
                );
            }
        });
    });

    app.post('/contractors/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.contractor.editItem(req.user, req.params.id, req.body, function(result){
            res.json(result);
        });
    });

    app.post('/contractors/getlist', app.ensureAuthenticated, function(req, res){
        controllers.contractor.getList(req.user, function(result){
            res.json(result);
        });
    });

    app.post('/contractors/getitem/:id', app.ensureAuthenticated, function(req, res){
        controllers.contractor.getItem(req.user, req.params.id, function(result){
            res.json(result);
        });
    });

    app.post('/contractors/add', app.ensureAuthenticated, function(req, res){
        controllers.contractor.addItem(req.user, req.params.id, req.body, function(result){
            res.json(result);
        });
    });

    app.post('/contractors/check/:step', app.ensureAuthenticated, function(req, res){
        res.json(controllers.contractor.validateInputs(req.body, parseInt(req.params.step)));
    });

    app.post('/contractors/delete', app.ensureAuthenticated, function(req, res){
        controllers.contractor.deleteItems(req.user, req.body.ids, function(result){
            res.json(result);
        });
    });
};
module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'accounts'
    };

    app.get('/accounts', app.ensureAuthenticated, function(req, res){
        var filters = {},
            date_range = '';

        if(req.query.date_from && req.query.date_to){
            filters.date_from = req.query.date_from;
            filters.date_to = req.query.date_to;

            date_range = 'range';

        } else if(req.query.date_range) {
            var from = new Date(),
                to = new Date();

            switch(req.query.date_range){
                case 'last_month' : {
                    date_range = req.query.date_range;
                    from.setDate(1);
                } break;
            }

            filters.date_from = app.utils.pad(from.getDate(), 2) + '.' + app.utils.pad(from.getMonth() + 1, 2) + '.' + from.getFullYear();
            filters.date_to = app.utils.pad(to.getDate(), 2) + '.' + app.utils.pad(to.getMonth() + 1, 2) + '.' + to.getFullYear();
        }

        controllers.account.findItems(req.user, filters, function(err, data){
            var params = app.utils.extend(common, {
                err: err,
                data: data,
                user: req.user,
                filters: filters,
                date_range: date_range,
                metadata: {
                    title: 'Счета'
                }
            });

            res.render('accounts', params);
        });
    });

    app.get('/accounts/add', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            number: (req.user.mc_account >= 0) ? req.user.mc_account + 1 : '',
            metadata: {
                title: 'Новый счет'
            }
        });

        res.render('accounts.add.jade', params);
    });

    app.post('/accounts/delete', app.ensureAuthenticated, function(req, res){
        controllers.account.deleteItems(req.user, req.body.ids, function(result){
            res.json(result);
        });
    });

    app.get('/accounts/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.findOne(req.user, req.params.id, function(err, data){
            if(err === true || !data){
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

    app.post('/accounts/renderlist', app.ensureAuthenticated, function(req, res){
        if(req.body.ids){
            var ids_in = req.body.ids.split(',');
        }

        controllers.account.findItems(req.user, { _id: { $in: ids_in }}, function(err, data){
            var params = app.utils.extend(common, {
                err: err,
                data: data,
                user: req.user,
                stamp_path: '/user/' + req.user._id + '/company/' + req.user.current_company + '/assets/stamp.png',
                stamp_exists: false,
                metadata: {
                    title: 'Счета'
                }
            });

            app.utils.fsExists(__dirname + '/../public' + params.stamp_path, function(exists){
                if (exists) {
                    params.stamp_exists = true;
                }

                res.render('accounts.list.render.jade', params);
            });
        });
    });

    app.get('/accounts/render/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.findOne(req.user, req.params.id, function(err, data){
            if(err === true || !data){
                res.redirect('/404');
            }else{
                var params = app.utils.extend(common, {
                    err : err,
                    data: data,
                    user: req.user,
                    stamp_path: '/user/' + req.user._id + '/company/' + req.user.current_company + '/assets/stamp.png',
                    stamp_exists: false,
                    metadata: {
                        title: 'Просмотр счета'
                    }
                });

                app.utils.fsExists(__dirname + '/../public' + params.stamp_path, function(exists){
                    if (exists) {
                        params.stamp_exists = true;
                    }

                    res.render('accounts.render.jade', params);
                });
            }
        });
    });

    app.get('/accounts/pdf/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.findOne(req.user, req.params.id, function(err, data){
            if(err === true || !data){
                res.redirect('/404');
            }else{
                var url = app.config.get('protocol') + '://localhost:' + app.config.get('port') + '/accounts/view/' + req.params.id,
                    file_name = 'Счет №' + data.number + ' от ' + app.utils.humanizeDate(data.date);

                app.utils.generateDocument(url, req.cookies['connect.sid'], 'pdf', function(file_data){
                    app.utils.downloadStream(file_name, 'application/pdf', file_data, res);
                });
            }
        });
    });

    app.get('/accounts/image/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.createImage(req.params.id, req, function(result){
            res.json(result);
        });
    });

    app.post('/accounts/send/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.send(req, function(result){
            res.json(result);
        });
    });

    app.post('/accounts/viewcustom', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            data: req.body,
            user: req.user,
            metadata: {
                title: 'Просмотр счета'
            }
        });
		
        params.data.date = app.utils.parseDate(params.data.date);
        params.data.items = JSON.parse(decodeURIComponent(params.data.items));
        params.data.contractor = JSON.parse(decodeURIComponent(params.data.contractor));

        res.render('accounts.render.jade', params);
    });

    app.post('/accounts/add', app.ensureAuthenticated, function(req, res){
        controllers.account.addItem(req.user, req.body, req, function(result){
            res.json(result);
        });
    });

    app.post('/accounts/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.account.editItem(req, function(result){
            res.json(result);
        });
    });
};
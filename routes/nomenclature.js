module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'nomenclature'
    };

    var _this = this;

    this.getNomgroup = function(nomgroups, nomgroup){
        for(var i = 0, l = nomgroups.length; i < l; i++){
            if(nomgroup == nomgroups[i]._id){
                return nomgroups[i];
            }
        }
    };

    this.getNomgroups = function(user, params, done){
        controllers.nomgroup.findItems(user, function(err, data){
            params.err = err;
            params.nomgroups = data;
            params.getNomgroup = _this.getNomgroup;

            done(params);
        });
    };

    this.getNomenclature = function(user, params, done){
        controllers.nomenclature.findItems(user, params.filters, function(err, data){
            params.data = data;
            params.err = err;

            _this.getNomgroups(user, params, function(params){
                done(params);
            });
        });
    };

    app.get('/nomenclature/add', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            number: (req.user.mc_nomenclature >= 0) ? req.user.mc_nomenclature + 1 : '',
            freegroup: false,
            nomgroup: null,
            metadata: {
                title: 'Новая позиция'
            }
        });

        _this.getNomgroups(req.user, params, function(params){
            res.render('nomenclature.add.jade', params);
        });
    });

    app.get('/nomenclature/:nomgroup/add', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            number: (req.user.mc_nomenclature >= 0) ? req.user.mc_nomenclature + 1 : '',
            freegroup: false,
            metadata: {
                title: 'Новая позиция'
            }
        });

        _this.getNomgroups(req.user, params, function(params){
            res.render('nomenclature.add.jade', params);
        });
    });

    app.post('/nomenclature/add', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.addItem(req.user, req.body, req.session, function(result){
            res.json(result);
        });
    });

    app.get('/nomenclature/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.findOne(req.user, req.params.id, null, function(err, data){
            if(err === true || !data){
                res.redirect('/404');
            }else{
                var params = app.utils.extend(common, {
                    err : err,
                    data: data,
                    user: req.user,
                    freegroup: false,
                    nomgroup: null,
                    metadata: {
                        title: 'Редактирование позиции'
                    }
                });

                _this.getNomgroups(req.user, params, function(params){
                    res.render('nomenclature.edit.jade', params);
                });
            }
        });
    });

    app.get('/nomenclature/:nomgroup/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.findOne(req.user, req.params.id, req.params.nomgroup, function(err, data){
            if(err === true || !data){
                res.redirect('/404');
            }else{
                var params = app.utils.extend(common, {
                    err : err,
                    data: data,
                    user: req.user,
                    freegroup: false,
                    nomgroup: null,
                    metadata: {
                        title: 'Редактирование позиции'
                    }
                });

                controllers.nomgroup.findOne(req.user, req.params.nomgroup, function(err, data){
                    params.nomgroup = data;

                    _this.getNomgroups(req.user, params, function(params){
                        res.render('nomenclature.edit.jade', params);
                    });
                });
            }
        });
    });

    app.post('/nomenclature/edit/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomenclature.editItem(req.user, req.params.id, req.body, function(result){
            res.json(result);
        });
    });

    app.get('/nomenclature', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            nomgroup: null,
            freegroup: false,
            filters: {},
            metadata: {
                title: 'Номенклатура'
            }
        });

        _this.getNomenclature(req.user, params, function(params){
            res.render('nomenclature', params);
        });
    });

    app.get('/nomenclature/free', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            nomgroup: null,
            freegroup: true,
            filters: {
                nomgroup: null
            },
            metadata: {
                title: 'Номенклатура'
            }
        });

        _this.getNomenclature(req.user, params, function(params){
            res.render('nomenclature', params);
        });
    });

    app.get('/nomenclature/:nomgroup', app.ensureAuthenticated, function(req, res){
        controllers.nomgroup.findOne(req.user, req.params.nomgroup, function(err, data){
            if(err === true || !data){
                res.redirect('/404');
            }else{
                var params = app.utils.extend(common, {
                    err: err,
                    data: data,
                    user: req.user,
                    nomgroup: data,
                    freegroup: false,
                    filters: {
                        nomgroup: data._id
                    },
                    metadata: {
                        title: 'Номенклатура'
                    }
                });

                _this.getNomenclature(req.user, params, function(params){
                    res.render('nomenclature', params);
                });
            }
        });
    });

    app.post('/nomenclature/addnomgroup', app.ensureAuthenticated, function(req, res){
        controllers.nomgroup.addItem(req.user, req.body, req.session, function(result){
            res.json(result);
        });
    });

    app.post('/nomenclature/editnomgroup/:id', app.ensureAuthenticated, function(req, res){
        controllers.nomgroup.editItem(req.user, req.params.id, req.body, function(result){
            res.json(result);
        });
    });

    app.post('/nomenclature/deletenomgroups', app.ensureAuthenticated, function(req, res){
        controllers.nomgroup.deleteItems(req.user, req.body.ids, function(result){
            res.json(result);
        });
    });

	app.post('/nomenclature/getnomgroups', app.ensureAuthenticated, function(req, res){
		controllers.nomgroup.findItems(req.user, function(err, data){
			res.json(data);
		});
	});

    app.post('/nomenclature/nomgroupssortupdate', app.ensureAuthenticated, function(req, res){
        controllers.nomgroup.sortUpdate(req.user, req.body.sortlist, function(err, data){
            res.json(data);
        });
    });

	app.post('/nomenclature/getnomenclature/:nomgroup', app.ensureAuthenticated, function(req, res){
		var filters = {
            nomgroup: null
		};

		if(req.params.nomgroup && req.params.nomgroup != 'freegroup'){
			filters.nomgroup = req.params.nomgroup;
		}

		controllers.nomenclature.findItems(req.user, filters, function(err, data){
			res.json(data);
		});
	});

	app.post('/nomenclature/getnomenclature', app.ensureAuthenticated, function(req, res){
		var filters = {};

		controllers.nomenclature.findItems(req.user, filters, function(err, data){
			res.json(data);
		});
	});

	app.post('/nomenclature/delete', app.ensureAuthenticated, function(req, res){
		controllers.nomenclature.deleteItems(req.user, req.body.ids, function(result){
			res.json(result);
		});
	});
};
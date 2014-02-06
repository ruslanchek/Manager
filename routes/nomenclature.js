module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'nomenclature'
    };

    var _this = this;

    this.getNomgroups = function(user, params, done){
        controllers.nomgroup.findItems(user, function(err, data){
            params.err = err;
            params.nomgroups = data;

            done(params);
        });
    };

    this.getNomenclature = function(user, params, done){
        controllers.nomenclature.findItems(user, function(err, data){
            params.data = data;
            params.err = err;

            _this.getNomgroups(user, params, function(params){
                done(params);
            });
        });
    };

    app.get('/nomenclature', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            nomgroup: false,
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
            var params = app.utils.extend(common, {
                err: err,
                data: data,
                user: req.user,
                nomgroup: data,
                metadata: {
                    title: 'Номенклатура'
                }
            });

            _this.getNomenclature(req.user, params, function(params){
                res.render('nomenclature', params);
            });
        });
    });

    app.post('/nomenclature/addnomgroup', app.ensureAuthenticated, function(req, res){
        controllers.nomgroup.addItem(req.user, req.body, function(result){
            res.json(result);
        });
    });
};
module.exports = function(app, controllers){
    var common = {
        utils: app.utils
    };

    /**
     * Get routes
     * */
    app.get('/company/add', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            section: 'main',
            mode: 'add',
            data: {},
            metadata: {
                title: 'Новая компания'
            }
        });

        res.render('company.master.jade', params);
    });

    app.get('/company/edit', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            section: 'main',
            mode: 'edit',
            data: {},
            metadata: {
                title: 'Новая компания'
            }
        });

        res.render('company.master.jade', params);
    });

    app.post('/company/add/step1', app.ensureAuthenticated, function(req, res){
        controllers.company.checkStep1(req.body, function(result){
            res.json(result);
        });
    });

    app.post('/company/add/step2', app.ensureAuthenticated, function(req, res){
        controllers.company.checkStep2(req.body, function(result){
            res.json(result);
        });
    });

    app.post('/company/add/step3', app.ensureAuthenticated, function(req, res){
        controllers.company.checkStep3(req.body, function(result){
            res.json(result);
        });
    });

    app.post('/company/add/step4', app.ensureAuthenticated, function(req, res){
        controllers.company.checkStep4(req.body, function(result){
            res.json(result);
        });
    });
};
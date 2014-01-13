module.exports = function(app, controllers){
    app.get('/accounts', app.ensureAuthenticated, function(req, res){
        controllers.account.findItems(req.user, function(err, data){
            res.render('accounts', { err: err, data: data });
        });
    });

    app.post('/accounts/:action', app.ensureAuthenticated, function(req, res){
        switch(req.params.action){
            case 'add' : {
                controllers.account.addItem(req.user, req.body, function(result){
                    res.json(result);
                });
            } break;
        }
    });
};
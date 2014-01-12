module.exports = function(app, controllers){
    app.get('/accounts', app.ensureAuthenticated, function(req, res){
        controllers.account.findItems(req.user, function(err, data){
            res.render('accounts', { err: err, data: data });
        });
    });
};
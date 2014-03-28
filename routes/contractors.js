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
};
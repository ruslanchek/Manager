var fss = require('fs');

module.exports = function(app, controllers){
    var common = {
        utils: app.utils,
        section: 'settings'
    };

    app.get('/settings', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            metadata: {
                title: 'Настройка'
            }
        });

        res.render(
            'settings',
            params
        );
    });

    app.post('/settings/company', app.ensureAuthenticated, function(req, res){
        controllers.user.edit(req, function(result){
            res.json(result);
        });
    });

    app.post('/settings/company/uploadstamp', app.ensureAuthenticated, function(req, res){
        var base64Data = req.body.img_b64.replace(/^data:image\/png;base64,/, '');

        var random_name = app.utils.generateRandomSeed(),
            pdf_filename = __dirname + '/../generated/tmp/png/' + random_name + '.png';

        fss.writeFile(pdf_filename, base64Data, 'base64', function(err) {
            console.log(err);
        });
    });
};
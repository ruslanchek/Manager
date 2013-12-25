/**
 * Requires
 * */
var mongoose = require('mongoose');

module.exports = function(app){
    /**
     * Connect
     * */
    mongoose.connect(app.config.get('mongoose:uri'));

    var db = mongoose.connection;

    db.on('error', function (err) {
        app.log.error('Mongoose connection error:', err.message);
    });

    db.once('open', function callback () {
        app.log.info("Mongoose connected to DB!");
    });

    this.Schema      = mongoose.Schema;
    this.mongoose    = mongoose;

    return this;
}

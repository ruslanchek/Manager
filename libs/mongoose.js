/**
 * Requires
 * */
var mongoose    = require('mongoose'),
    log         = require('./log')(module),
    config      = require('./config');

/**
 * Connect
 * */
mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('Mongoose connection error:', err.message);
});

db.once('open', function callback () {
    log.info("Mongoose connected to DB!");
});

exports.Schema = mongoose.Schema;
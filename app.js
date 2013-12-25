/**
 * Requires
 */
var config = require('./libs/config');
var log = require('./libs/log')(module);

var bootable = require('bootable');
var express = require('express');
var http = require('http');


/**
 * App init
 * */
var app = bootable(express());

app.phase(bootable.initializers('./inits'));
app.phase(bootable.routes('./routes/common'));
app.phase(bootable.routes('./routes/auth'));

app.boot(function(err) {
    if (err) { throw err; }

    /**
     * Server
     * */
    http.createServer(app).listen(2000, function () {
        log.info('Express server listening on port ' + 2000);
    });
});
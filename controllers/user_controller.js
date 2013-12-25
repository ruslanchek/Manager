/**
 * Users operations class
 * @type {exports|*}
 */
var express = require('express');
var crypto = require('crypto');
var generatePassword = require('password-generator');
var log = require('./../libs/log')(module);
var utils = require('./../libs/utils');
var mongoose = require('mongoose');
var Schema = require('./../libs/mongoose').Schema;

var app = express();

/**
 * Users schemas
 * */

function processSchemas(){
    var User = new Schema({
        username: {
            type: String,
            required: true
        },

        displayName: {
            type: String
        },

        hashedPassword: {
            type: String,
            required: true
        },

        salt: {
            type: String,
            required: true
        },

        created: {
            type: Date,
            default: Date.now
        },

        twitter_id: {
            type: String
        },

        facebook_id: {
            type: String
        }
    });

    User.methods.encryptPassword = function(password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512); //TODO: try more secure
    };

    User.virtual('userId')
        .get(function () {
            return this.id;
        });

    User.virtual('password')
        .set(function(password) {
            this._plainPassword = password;
            this.salt = crypto.randomBytes(32).toString('base64');
            //more secure - this.salt = crypto.randomBytes(128).toString('base64'); //TODO: try more secure
            this.hashedPassword = this.encryptPassword(password);
        })
        .get(function() { return this._plainPassword; });

    User.methods.checkPassword = function(password) {
        return this.encryptPassword(password) === this.hashedPassword;
    };

    return User;
}


/**
 * Users model
 * */
var UserModel = mongoose.model('User', processSchemas());


/**
 * Private Methods
 * */



/**
 * Public Methods
 * */
this.findOrCreate = function (provider, profile, done) {
    var conditions,
        create_data;

    if (!profile.id || !profile.displayName) { return done(err); }

    switch(provider){
        case 'facebook' : {
            conditions = { facebook_id: profile.id };
            create_data = { facebook_id: profile.id, displayName: profile.displayName, username: profile.username };
        } break;

        case 'twitter' : {
            conditions = { twitter_id: profile.id };
            create_data = { twitter_id: profile.id, displayName: profile.displayName, username: profile.username };
        } break;
    }

    UserModel.findOne(conditions, null, null, function(err, user) {
        if (err) { return done(err); }

        if (user) {
            done(null, user);

        }else{
            var user = new UserModel(
                utils.extend(
                    {
                        password: generatePassword(12, false)
                    },
                    create_data
                )
            );

            user.save(function(err, user) {
                if (err) { return done(err); }
                done(null, user);

                log.info("User created: ", user.username);
            });
        }
    });
}


this.findOne = function (username, password, done) {
    UserModel.findOne({username: username}, null, null, function(err, user) {
        if (err) { return done(err); }

        if (!user.checkPassword(password)) { return done(null, false); }

        if (user) {
            done(null, user);
        }
    });
}


/*
if (err) { return done(err); }

if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
}

if (!user.validPassword(password)) {
    return done(null, false, { message: 'Incorrect password.' });
}

return done(null, user);
    */
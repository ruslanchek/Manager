var crypto = require('crypto');

module.exports = function(app){
    var Schema    = app.mongoose.Schema;

    /**
     * Schema
     * */
    var User = new Schema({
        username: {
            type: String,
            required: true,
            index: true
        },

        email: {
            type: String,
            index: true
        },

        display_name: {
            type: String
        },

        hashed_password: {
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
        },

        google_id: {
            type: String
        },

        vk_id: {
            type: String
        },

        yandex_id: {
            type: String
        }
    });

    /**
     * Virtual
     * */
    User.virtual('password')
        .set(function(password) {
            this._plain_password = password;
            this.salt = crypto.randomBytes(32).toString('base64');
            //more secure - this.salt = crypto.randomBytes(128).toString('base64'); //TODO: try more secure
            this.hashed_password = this.encryptPassword(password);
        })
        .get(function() { return this._plain_password; });

    User.virtual('userId')
        .get(function () {
            return this.id;
        });

    /**
     * Methods
     * */
    User.methods.encryptPassword = function(password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512); //TODO: try more secure
    };

    User.methods.checkPassword = function(password) {
        return this.encryptPassword(password) === this.hashed_password;
    };

    this.model = app.mongoose.mongoose.model('User', User);

    return this;
};
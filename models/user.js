var crypto = require('crypto');

module.exports = function (app) {
    /**
     * Schema
     * */
    var schema = new app.mongoose.Schema({
        username: {
            type: String,
            index: true,
            unique: true,
            required: true
        },

        email: {
            type: String,
            index: true,
            unique: true,
            sparse: true
        },

        restore_date: {
            type: Date
        },

        restore_hash: {
            type: String
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
            type: String,
            unique: true,
            sparse: true
        },

        facebook_id: {
            type: String,
            unique: true,
            sparse: true
        },

        google_id: {
            type: String,
            unique: true,
            sparse: true
        },

        vk_id: {
            type: String,
            unique: true,
            sparse: true
        },

        yandex_id: {
            type: String,
            unique: true,
            sparse: true
        },


        // Company credentials
        cc_name: {
            type: String
        },

        cc_inn: {
            type: String
        },

        cc_kpp: {
            type: String
        },

        cc_ogrn: {
            type: String
        },

        cc_type: {
            type: Number
        },

        cc_city: {
            type: String
        },

        cc_index: {
            type: String
        },

        cc_street: {
            type: String
        },

        cc_house: {
            type: String
        },

        cc_phone: {
            type: String
        },

        cc_fax: {
            type: String
        },

        cc_email: {
            type: String
        },

        cc_skype: {
            type: String
        },

        cc_website: {
            type: String
        },

        cc_ceo_name: {
            type: String
        },

        cc_ceo_type: {
            type: Number
        },

        cc_accountant_name: {
            type: String
        },

        cc_accountant_type: {
            type: Number
        },


        // Bank credentials
        bank_name: {
            type: String
        },

        bank_bik: {
            type: String
        },

        bank_pay_account: {
            type: String
        },

        bank_corr_account: {
            type: String
        },

        // Model counters
        mc_account: {
            type: Number,
            default: 0
        },

        mc_nomenclature: {
            type: Number,
            default: 0
        },

        mc_nomgroup: {
            type: Number,
            default: 0
        },


        // Misc
        current_company: {
            type: String
        },

        companies: {
            type: Number,
            default: 0
        },

        approved_email: {
            type: Boolean,
            default: false
        }
    });


    /**
     * Validate
     * */
    schema.path('email').validate(function (email) {
        var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return pattern.test(email);
    }, 'PATTERN_MISSMATCH');


    /**
     * Virtual
     * */
    schema.virtual('password')
        .set(function (password) {
            this._plain_password = password;
            this.salt = crypto.randomBytes(32).toString('base64');
            //this.salt = crypto.randomBytes(128).toString('base64'); //TODO: try more secure
            this.hashed_password = this.encryptPassword(password);
        })
        .get(function () {
            return this._plain_password;
        });


    schema.virtual('userId')
        .get(function () {
            return this.id;
        });


    /**
     * Methods
     * */
    schema.methods.encryptPassword = function (password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        //return crypto.pbkdf2Sync(password, this.salt, 10000, 512); //TODO: try more secure
    };

    schema.methods.checkPassword = function (password) {
        return this.encryptPassword(password) === this.hashed_password;
    };

    this.model = app.mongoose.mongoose.model('User', schema);

    return this;
};
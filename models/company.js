module.exports = function (app) {
    /**
     * Schema
     * */
    var schema = new app.mongoose.Schema({
        _user_id : {
            type: String,
            index: true,
            ref: 'User',
            required: true
        },

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
        }
    });

    this.model = app.mongoose.mongoose.model('Company', schema);

    return this;
};
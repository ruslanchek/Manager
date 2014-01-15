module.exports = function (app) {
    /**
     * Schema
     * */
    var schema = new app.mongoose.Schema({
        _user_id : {
            type: String,
            ref: 'User',
            required: true
        },

        name: {
            type: String,
            index: true,
            required: true
        },

        type: {
            type: Number,
            required: true,
            default: 1
        },

        inn: {
            type: String
        },

        kpp: {
            type: String
        },

        city: {
            type: String
        },

        index: {
            type: String
        },

        address: {
            type: String
        },

        tel: {
            type: String
        },

        r_account: {
            type: String
        },

        bik: {
            type: String
        },

        bank: {
            type: String
        },

        k_account: {
            type: String
        },

        director_type: {
            type: Number
        },

        director: {
            type: String
        },

        accountant_type: {
            type: Number
        },

        accountant: {
            type: String
        }
    });

    this.model = app.mongoose.mongoose.model('Company', schema);

    return this;
};
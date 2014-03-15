module.exports = function (app) {
    /**
     * Schema
     * */
    var schema = new app.mongoose.Schema({
        _user_id : {
            type: String,
            ref: 'User',
            index: true,
            required: true
        },

        _company_id : {
            type: String,
            index: true,
            ref: 'Company',
            required: true
        },

        _nomgroup_id: {
            type: String,
            index: true,
            ref: 'Nomgroup'
        },

        article: {
            type: String,
            index: true,
            required: true
        },

        price: {
            type: Number,
            required: true,
            default: 0
        },

        unit: {
            type: String
        },

        name: {
            type: String
        }
    });

    this.model = app.mongoose.mongoose.model('Nomenclature', schema);

    return this;
};
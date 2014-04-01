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
        },

        nomgroup: {
            type: app.mongoose.Schema.Types.ObjectId,
            index: true,
            ref: 'Nomgroup'
        }
    });

    this.model = app.mongoose.mongoose.model('Nomenclature', schema);

    return this;
};
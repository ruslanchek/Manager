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

        order: {
            type: Number
        },

        name: {
            type: String
        }
    });

    this.model = app.mongoose.mongoose.model('Nomgroup', schema);

    return this;
};
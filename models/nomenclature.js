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

        /*_company_id : {
            type: String,
            index: true,
            ref: 'Company',
            required: true
        },

        _nom_group_id: {
            type: String,
         index: true,
            ref: 'Nomgroup'
        },
        */

        article: {
            type: String,
            index: true,
            required: true
        },

        /*
        * 1 - service
        * 2 - item
        * */
        type: {
            type: Number,
            index: true
        },

        price: {
            type: Number,
            required: true,
            default: 0
        },

        name: {
            type: String
        }
    });

    this.model = app.mongoose.mongoose.model('Account', schema);

    return this;
};
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

        number: {
            type: String,
            index: true,
            required: true
        },

        date: {
            type: Date,
            required: true,
            index: true,
            default: Date.now
        },

        sum: {
            type: Number,
            required: true,
            default: 0
        },

        items: {
            type: Array
        }
    });

    this.model = app.mongoose.mongoose.model('Account', schema);

    return this;
};
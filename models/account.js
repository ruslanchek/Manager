module.exports = function (app) {
    /**
     * Schema
     * */
    var schema = new app.mongoose.Schema({
        _user_id : { type: String, ref: 'User' },

        name: {
            type: String,
            index: true,
            unique: true,
            required: true
        },

        date: {
            type: Date,
            required: true,
            index: true,
            default: Date.now
        }
    });

    this.model = app.mongoose.mongoose.model('Account', schema);

    return this;
};
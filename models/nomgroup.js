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

        name: {
            type: String
        }
    });

    this.model = app.mongoose.mongoose.model('Nomgroup', schema);

    return this;
};
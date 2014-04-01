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

        _company_id : {
            type: String,
            index: true,
            ref: 'Company',
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

        nds: {
            type: Number,
            required: true,
            default: 0
        },

        count: {
            type: Number,
            required: true,
            default: 0
        },

        status: {
            type: Boolean,
            default: 0
        },

        items: {
            type: Array,
            default: []
        },

        comment: {
            type: String
        },

        contractor: {
            type: app.mongoose.Schema.Types.ObjectId,
            ref: 'Contractor'
        }
    });

    this.model = app.mongoose.mongoose.model('Account', schema);

    return this;
};
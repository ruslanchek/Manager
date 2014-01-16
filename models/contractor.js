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

        /*
         * <select name="legal_type_id">
         *     <option value="1" selected="">ООО</option>
         *     <option value="2">ЗАО</option>
         *     <option value="3">ОАО</option>
         *     <option value="4">ИП</option> ОГРНИП
         *     <option value="5">ПБЮЛ</option>
         *     <option value="6">ГУП</option>
         *     <option value="7">МУП</option>
         *     <option value="8">НП</option>
         *     <option value="9">АНО</option>
         *     <option value="10">Другое</option>
         * </select>
         * */

        type: {
            type: Number,
            required: true,
            default: 1
        },

        inn: {
            type: String
        },

        ogrnip: {
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

    this.model = app.mongoose.mongoose.model('Contractor', schema);

    return this;
};
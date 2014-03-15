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

        _company_id : {
            type: String,
            index: true,
            ref: 'Company',
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

        // Company credentials
        cc_name: {
            type: String
        },

        cc_inn: {
            type: String
        },

        cc_kpp: {
            type: String
        },

        cc_ogrn: {
            type: String
        },

        cc_type: {
            type: Number
        },

        cc_city: {
            type: String
        },

        cc_index: {
            type: String
        },

        cc_street: {
            type: String
        },

        cc_house: {
            type: String
        },

        cc_phone: {
            type: String
        },

        cc_fax: {
            type: String
        },

        cc_email: {
            type: String
        },

        cc_skype: {
            type: String
        },

        cc_ceo_name: {
            type: String
        },

        cc_ceo_type: {
            type: Number
        },

        cc_accountant_name: {
            type: String
        },

        cc_accountant_type: {
            type: Number
        },


        // Bank credentials
        bank_name: {
            type: String
        },

        bank_bik: {
            type: String
        },

        bank_pay_account: {
            type: String
        },

        bank_corr_account: {
            type: String
        }
    });

    this.model = app.mongoose.mongoose.model('Contractor', schema);

    return this;
};
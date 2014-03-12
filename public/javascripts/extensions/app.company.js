app.company = {
    CompanySelectController: function ( options ) {

    },

    noCompany: function(){
        if(document.location.pathname != '/company/add'){
            document.location.href = '/company/add';
        }
    }
};
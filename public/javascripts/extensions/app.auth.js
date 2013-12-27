app.auth = {
    logOut: function () {
        $.ajax({
            url: '/auth/logout',
            type: 'get',
            success: function (data) {
                if(data && data.success === true){
                    document.location.href = '/';
                }
            }
        })
    },

    bindControls: function(){
        $('.logout').off('click').on('click', function(){
            app.auth.logOut();
        });
    },

    init: function(){
        this.bindControls();

        new app.FormController({
            form_selector: '#form-login',
            url: '/auth/login',
            fields: {
                username: '#username',
                password: '#password'
            },
            onSuccess: function(data){
                setTimeout(function(){
                    location.href = '/';
                }, 200);
            }
        });

        new app.FormController({
            form_selector: '#form-password-recovery',
            url: '/auth/password-recovery',
            fields: {
                email: '#email'
            },
            onSuccess: function(data){

            }
        });
    }
}
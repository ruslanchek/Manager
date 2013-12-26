app.auth = {
    logOut: function () {
        $.ajax({
            url: '/logout',
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
            url: '/login',
            fields: {
                username: '#username',
                password: '#password'
            },
            success_message: 'Authentication success!',
            fail_message: 'Authentication failed!',
            onSuccess: function(data){
                setTimeout(function(){
                    location.href = '/';
                }, 200);
            }
        });
    }
}
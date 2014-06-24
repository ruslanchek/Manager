app.loading = {
    global_loading_pool: {},
    element_loading_pool: {},
    global_loading_interval: null,

    unSetGlobalLoading: function (name) {
        setTimeout(function () {
            if (name && app.loading.global_loading_pool[name]) {
                delete(app.loading.global_loading_pool[name]);
            }

            var current_in_pool = 0;

            $.each(app.loading.global_loading_pool, function () {
                current_in_pool++;
            });

            if (current_in_pool > 0) {
                return;
            }

            $('#loading-global').animate({
                top: -5,
                opacity: 0
            }, {
                duration: 150,
                complete: function(){
                    if (app.loading.global_loading_interval) {
                        clearInterval(app.loading.global_loading_interval);
                    }
                }
            });
        }, 450);
    },

    setGlobalLoading: function (name) {
        if (name) {
            this.global_loading_pool[name] = true;
        }

        $('#loading-global').animate({
            top: 0,
            opacity: 1
        }, {
            duration: 150
        });
    },

    setElementLoading: function(container_selector){
        if (container_selector && app.loading.element_loading_pool[container_selector]) {
            delete(app.loading.element_loading_pool[container_selector]);
        }

        var current_in_pool = 0;

        $.each(app.loading.element_loading_pool, function () {
            current_in_pool++;
        });

        if (current_in_pool > 0) {
            return;
        }

        $(container_selector).append('<span class="element-loading"><i class="icon-spin2 animate-spin"></i></span>');
    },

    unSetElementLoading: function(container_selector){
        if (container_selector) {
            this.element_loading_pool[container_selector] = true;
        }

        $(container_selector).find('.element-loading').remove();
    }
};
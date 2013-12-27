app.templates = {
    templates_stack: {},

    registerHelpers: function(){
        // Link
        Handlebars.registerHelper('link', function(text, url) {
            text = Handlebars.Utils.escapeExpression(text);
            url  = Handlebars.Utils.escapeExpression(url);

            var result = '<a href="' + url + '">' + text + '</a>';

            return new Handlebars.SafeString(result);
        });

        // List
        Handlebars.registerHelper('list', function(items, options) {
            var out = '<ul>';

            for(var i=0, l=items.length; i<l; i++) {
                out = out + '<li>' + options.fn(items[i]) + '</li>';
            }

            return out + '</ul>';
        });
    },

    getTemplateHTML: function(name, done){
        if(this.templates_stack[name]){
            return done(this.templates_stack[name]);
        }

        $.ajax({
            url: '/templates/' + name,
            type: 'get',
            dataType: 'html',
            beforeSend: function(){
                app.loading.setGlobalLoading('app.template.getTemplateHTML.' + name);
            },
            success: function(data){
                app.loading.unSetGlobalLoading('app.template.getTemplateHTML.' + name);

                app.templates.templates_stack[name] = data;

                done(data);
            },
            error: function(){
                app.loading.unSetGlobalLoading('app.template.getTemplateHTML.' + name);
            }
        });
    },

    render: function(name, context, done){
        this.getTemplateHTML(name, function(data){
            var template = Handlebars.compile(data),
                html = template(context);

            if(done){
                done(html);
            }
        });
    },

    init: function(){
        this.registerHelpers();
    }
};
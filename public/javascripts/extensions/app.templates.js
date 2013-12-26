app.templates = {
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
        $.ajax({
            url: '/templates/' + name,
            type: 'get',
            dataType: 'html',
            success: function(data){
                done(data);
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
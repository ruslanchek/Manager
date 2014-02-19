app.upload = {
    UploadImageWithCropController: function(options){
        var _this = this;

        this.id = app.utils.makeId(16);

        this.options = {
            selector: ''
        };

        $.extend(this.options, options);

        this.updatePreview = function(c){
            if (parseInt(c.w) > 0) {
                var rx = 220 / c.w, ry = 220 / c.h;
            }
        };

        this.showCoords = function(c){
            $('#x').val(c.x);
            $('#y').val(c.y);
            $('#x2').val(c.x2);
            $('#y2').val(c.y2);
            $('#w').val(c.w);
            $('#h').val(c.h);
        };

        this.drawInterface = function(){
            var template =  '<div>' +
                '<img id="canvasToThumb_{{prefix}}" src="http://www.extremetech.com/wp-content/uploads/2012/12/Audi-A1.jpg" />' +
                '</div>' +

                '<button id="crop_{{prefix}}">Crop</button>' +
                '<input type="text" id="x_{{prefix}}"  name="coord_x_{{prefix}}" />' +
                '<input type="text" id="y_{{prefix}}"  name="coord_y_{{prefix}}" />' +
                '<input type="text" id="x2_{{prefix}}" name="coord_x2_{{prefix}}"/>' +
                '<input type="text" id="y2_{{prefix}}" name="coord_y2_{{prefix}}"/>' +
                '<input type="text" id="w_{{prefix}}"  name="size_w_{{prefix}}"/>' +
                '<input type="text" id="h_{{prefix}}"  name="size_h_{{prefix}}"/>' +
                '<canvas id="canvasThumbResult_{{prefix}}" width="400" height="400"></canvas>';

            var html = app.templates.renderFromVar(template, { prefix: this.id });

            $(this.options.selector).html(html);

            $('#canvasToThumb_' + this.id).Jcrop({
                onChange: function(c){
                    _this.updatePreview(c);
                },
                onSelect: function(c){

                },
                bgFade: true,
                bgOpacity: .2,
                setSelect: [ 0, 0, 220, 220 ],
                aspectRatio: 1
            },function(){
                jcrop_api = this;
            });
        };

        this.drawInterface();
    }
};
app.crop = {
    BasicCropController: function(options){
        var _this = this;

        this.id = app.utils.makeId(16);

        this.options = {
            width: 230,
            selector: ''
        };

        $.extend(this.options, options);

        this.drawPreview = function(){

            /// step 1
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');
            oc.width = img.width * 0.5;
            oc.height = img.height * 0.5;
            octx.drawImage(img, 0,0, oc.width,oc.height);

            /// step 2
            octx.drawImage(oc,0,0,oc.width * 0.5,oc.height * 0.5);

            canvas.width=400;
            canvas.height=150;
            ctx.drawImage(oc,0,0,oc.width * 0.5, oc.height * 0.5,
                0,0,canvas.width,canvas.height);
        };

        this.updatePreview = function(c){
            var canvas = document.getElementById('crop-image-result-' + this.id),
                context = canvas.getContext('2d'),
                img = document.getElementById('crop-image-source-' + this.id),
                $img = $(img),
                imgW = img.width,
                imgH = img.height;

            var ratioY = imgH / $img.height(),
                ratioX = imgW / $img.width();

            var getX = c.x * ratioX,
                getY = c.y * ratioY,
                getWidth = c.w * ratioX,
                getHeight = c.h * ratioY;

            context.drawImage(img, getX, getY, getWidth, getHeight, 0, 0, 320, 320);
        };

        this.drawInterface = function(){
            var template =  '<div>' +
                                '<img id="crop-image-source-{{prefix}}" style="width: {{width}}px" src="http://www.hddprotector.com/f/account1.png" />' +
                            '</div>' +

                            '<canvas id="crop-image-result-{{prefix}}" width="320" height="320"></canvas>';

            var html = app.templates.renderFromVar(template, { prefix: this.id, width: this.options.width });

            $(this.options.selector).html(html);

            $('#crop-image-source-' + this.id).Jcrop({
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
    },

    CropControllerWithUpload: function(){

    }
};
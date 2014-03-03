app.crop = {
    BasicCropController: function(options){
        var _this = this;

        this.id = app.utils.makeId(16);

        this.options = {
            selector: ''
        };

        $.extend(this.options, options);

        this.updatePreview = function(c){
            var canvas = document.getElementById('crop-image-result-' + this.id),
                context = canvas.getContext('2d'),

                img = document.getElementById('crop-image-source-' + this.id),
                $img = $(img),
                imgW = img.width,
                imgH = img.height;

            context.webkitImageSmoothingEnabled = true;
            context.mozImageSmoothingEnabled = true;
            context.imageSmoothingEnabled = true;

            var ratioY = imgH / $img.height(),
                ratioX = imgW / $img.width();

            var getX = c.x * ratioX,
                getY = c.y * ratioY,
                getWidth = c.w * ratioX,
                getHeight = c.h * ratioY;

            context.drawImage(img, getX, getY, getWidth, getHeight, 0, 0, 240, 240);
        };

        this.drawCropInterface = function(){
            app.templates.render('crop.crop-tool.html', { prefix: this.id, width: this.options.width }, function(html){
                $(_this.options.selector).html(html);

                $('#crop-image-source-' + _this.id).Jcrop({
                    onChange: function(c){
                        _this.updatePreview(c);
                    },
                    onSelect: function(c){

                    },
                    bgFade: true,
                    bgOpacity: .2,
                    setSelect: [ 0, 0, 100, 100 ],
                    aspectRatio: 1
                },function(){
                    var jcrop_api = this;
                });
            });
        };

        this.drawUploadInterface = function(){
            app.templates.render('crop.upload-tool.html', { }, function(html){
                $(_this.options.selector).html(html);
            });
        };

        this.drawUploadInterface();
    },

    CropControllerWithUpload: function(){

    }
};
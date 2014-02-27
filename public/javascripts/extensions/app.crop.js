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
                canvas2 = document.getElementById('crop-image-result-2-' + this.id),
                context = canvas.getContext('2d'),
                context2 = canvas2.getContext('2d'),

                img = document.getElementById('crop-image-source-' + this.id),
                $img = $(img),
                imgW = img.width,
                imgH = img.height;

            context.webkitImageSmoothingEnabled = true;
            context.mozImageSmoothingEnabled = true;
            context.imageSmoothingEnabled = true;

            context2.webkitImageSmoothingEnabled = true;
            context2.mozImageSmoothingEnabled = true;
            context2.imageSmoothingEnabled = true;

            var ratioY = imgH / $img.height(),
                ratioX = imgW / $img.width();

            var getX = c.x * ratioX,
                getY = c.y * ratioY,
                getWidth = c.w * ratioX,
                getHeight = c.h * ratioY;

            context.drawImage(img, getX, getY, getWidth, getHeight, -15, -15, 240, 240);
            context2.drawImage(img, getX, getY, getWidth, getHeight, 0, 0, 240, 240);
        };

        this.drawInterface = function(){
            var template =  '<div class="crop-tool">' +
                                '<div class="original">' +
                                    '<img id="crop-image-source-{{prefix}}" src="http://www.hddprotector.com/f/account1.png" />' +
                                '</div>' +

                                '<div class="preview">' +
                                    '<div class="result">' +
                                        '<canvas class="result" id="crop-image-result-{{prefix}}" width="210" height="210"></canvas>' +
                                        '<canvas class="result-2" id="crop-image-result-2-{{prefix}}" width="240" height="240"></canvas>' +
                                    '</div>' +

                                    '<a href="#" class="button blue">Сохранить</a>' +
                                '</div>' +

                                '<div class="clear"></div>' +
                            '</div>';

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
                setSelect: [ 0, 0, 100, 100 ],
                aspectRatio: 1
            },function(){
                var jcrop_api = this;
            });
        };

        this.drawInterface();
    },

    CropControllerWithUpload: function(){

    }
};
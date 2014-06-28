app.crop = {
    BasicCropController: function(options){
        var _this = this;

        this.id = app.utils.makeId(16);
        this.img_b64 = null;

        this.options = {
            _id: '',
            selector: '',
            image_exists: false,
            image_path: '',
            upload_url: ''
        };

        $.extend(this.options, options);

        this.form_controller = new app.form.FormController({
            form_selector: '#form-upload-crop',
            show_success_message: true
        });

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

            try {
                context.drawImage(img, getX, getY, getWidth, getHeight, 0, 0, 240, 240);
                this.img_b64 = canvas.toDataURL();
            } catch(e) {

            }
        };

        this.cancelCrop = function(){
            $('.crop-tool-' + this.id).fadeOut(300, function(){
                $('.crop-upload').animate({
                    height: $('.upload-tool-' + _this.id).height()
                });

                $('.upload-tool-' + _this.id).fadeIn(300, function(){
                    $('.crop-tool-' + _this.id).remove();
                });
            });

            this.resetUploadField();
        };

        this.deleteImage = function(){
            if(!confirm('Удалить загруженное изображение?')){
                return;
            }

            $.ajax({
                type: 'post',
                url: _this.options.delete_url,
                beforeSend: function(){
                    app.loading.setGlobalLoading('crop-delete');
                },
                success: function(data){
                    _this.form_controller.pushFormMessage(true, 'Изображение удалено');
                    app.loading.unSetGlobalLoading('crop-delete');

                    $('.upload-icon').css({
                        opacity: 0.15
                    });

                    $('.image-icon').attr('src', '').css({
                        display: 'none'
                    });

                    $('.delete-image').hide();

                    setTimeout(function(){
                        _this.cancelCrop();
                    }, 400);
                },
                error: function(){
                    app.loading.unSetGlobalLoading('crop-delete');
                }
            });
        };

        this.uploadImage = function(){
            $.ajax({
                type: 'post',
                url: _this.options.upload_url,
                data: {
                    img_b64: this.img_b64
                },
                beforeSend: function(){
                    app.loading.setGlobalLoading('crop-upload');
                },
                success: function(data){
                    _this.form_controller.pushFormMessage(true, 'Изображение сохранено');
                    app.loading.unSetGlobalLoading('crop-upload');

                    $('.upload-icon').css({
                        opacity: 0
                    });

                    $('.image-icon').attr('src', data.data.filename + '?' + new Date().getTime()).css({
                        display: 'block'
                    });

                    $('.delete-image').show();

                    setTimeout(function(){
                        _this.cancelCrop();
                    }, 400);
                },
                error: function(){
                    app.loading.unSetGlobalLoading('crop-upload');
                }
            });
        };

        this.drawCropInterface = function(image_src){
            app.templates.render('crop.crop-tool.html', { prefix: this.id, src: image_src }, function(html){
                $(_this.options.selector).append(html);

                setTimeout(function(){
                    app.loading.unSetGlobalLoading('filereader-crop');

                    var h =  $('.crop-tool-' + _this.id).height();

                    $('.crop-upload').animate({
                        height: h
                    }, 400, function(){
                        $('.upload-tool-' + _this.id).fadeOut(300);
                        $('.crop-tool-' + _this.id).fadeIn(300);
                    });

                    setTimeout(function(){
                        $('#crop-image-source-' + _this.id).Jcrop({
                            onChange: function(c){
                                _this.updatePreview(c);
                            },
                            onSelect: function(c){

                            },
                            createHandles: ['nw','ne','se','sw'],
                            minSelect: [50, 50],
                            bgFade: true,
                            bgOpacity: .75,
                            setSelect: [ 0, 0, 100, 100 ],
                            aspectRatio: 1,
                            touchSupport: true
                        }, function(){
                            var jcrop_api = this;
                        });

                        $('.crop-cancel-' + _this.id).on('click', function(e){
                            e.preventDefault();
                            _this.cancelCrop();
                        });

                        $('.crop-save').on('click', function(e){
                            e.preventDefault();
                            _this.uploadImage();
                        });
                    }, 500);
                }, 400);
            });
        };

        this.resetUploadField = function(){
            var $file = $(this.options.selector).find('#upload-file-' + this.id);

            $file.wrap('<div />');

            $file.parent().html( $file.parent().html() );

            this.bindFileInputActions();
        };

        this.handleFileUpload = function(files){
            var file = files[0];

            if(file){
                file.ext = file.name.split('.').pop();
                file.size_mb = file.size / 1024 / 1024

                if(file.type != 'image/jpeg' && file.type != 'image/png'){
                    _this.form_controller.pushFormMessage(false, 'Загрузка изображений возможна только в формате JPEG или PNG');

                    this.resetUploadField();

                    return;
                }

                if(file.size_mb > 2){
                    _this.form_controller.pushFormMessage(false, 'Объем выбранного файла больше 2 МБ');

                    this.resetUploadField();

                    return;
                }

                var reader = new FileReader();

                app.loading.setGlobalLoading('filereader-crop');

                reader.onload = function(e){
                    _this.drawCropInterface(reader.result);
                };

                reader.readAsDataURL(file);
            }else{
                _this.form_controller.pushFormMessage(false, 'Ошибка чтения файла');
            }

            /*
            for (var i = 0, f; f = files[i]; i++) {
                console.log(escape(f.name), f.type, f.size, f);
            }*/
        };

        this.bindDropzone = function(){
            var drop_zone = document.getElementById('upload-dropzone-' + this.id);

            drop_zone.addEventListener('dragover', function(e){
                e.stopPropagation();
                e.preventDefault();

                $('#upload-dropzone-' + _this.id).parent().addClass('dragover');

                e.dataTransfer.dropEffect = 'copy';
            }, false);

            drop_zone.addEventListener('dragleave', function(e){
                e.stopPropagation();
                e.preventDefault();

                $('#upload-dropzone-' + _this.id).parent().removeClass('dragover');
            }, false);

            drop_zone.addEventListener('drop', function(e){
                e.stopPropagation();
                e.preventDefault();

                _this.handleFileUpload(e.dataTransfer.files);

                $('#upload-dropzone-' + _this.id).parent().removeClass('dragover');
            }, false);
        };

        this.bindFileInputActions = function(){
            var $file = $(_this.options.selector).find('#upload-file-' + this.id);

            $file.off('change').on('change', function(e){
                _this.handleFileUpload(e.target.files);
            });

            $(_this.options.selector).find('.upload-init-' + _this.id).off('click').on('click', function(e){
                e.preventDefault();
                $file.click();
            });
        };

        this.drawUploadInterface = function(){
            app.templates.render('crop.upload-tool.html', { prefix: this.id, image_exists: _this.options.image_exists, image_path: _this.options.image_path }, function(html){
                $(_this.options.selector).append(html);
                _this.bindFileInputActions();
                _this.bindDropzone();

                $('.delete-image').on('click', function(e){
                    _this.deleteImage();
                    e.preventDefault();
                });
            });
        };

        this.drawUploadInterface();
    },

    CropControllerWithUpload: function(){

    }
};
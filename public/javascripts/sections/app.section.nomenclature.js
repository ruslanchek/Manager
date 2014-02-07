app.sections.nomenclature = {
    selectItem: function(options){
        app.templates.render('nomenclature.select.html', {  }, function(html){
            app.sections.nomenclature.mc_select = new app.modal.ModalController({
                title: 'Выбор позиции из номенклатуры',
                content: html,
                onShow: function(controller){

                },
                onClose: function(){

                },
                width: 600
            }).open();
        });
    },

    list: {
        addNomgroup: function(){
            app.templates.render('nomenclature.add.html', {  }, function(html){
                app.sections.nomenclature.list.mc_add = new app.modal.ModalController({
                    title: 'Создание категории номернклатуры',
                    content: html,
                    onShow: function(controller){
                        new app.form.FormController({
                            form_selector: '#form-nomenclature-add',
                            url: '/nomenclature/addnomgroup',
                            fields: { name: '#na_name' },
                            messages: {
                                OK: 'Группа создана',
                                NAME_DOES_NOT_MATCH_PATTERN: 'Наименование некоректно',
                                DUBLICATE_NAME_FOUND: 'Категория с таким названием уже существует',
                                NAME_EMPTY: 'Не введено название'
                            },
                            onSuccess: function(data){
                                setTimeout(function(){
                                    controller.close();
                                    $('.side-menu').append(
                                        '<a data-id="' + data.data._id + '" href="/nomenclature/' + data.data._id + '">' +
                                            '<span class="nomgroup-name">' + data.data.name + '</span>' +
                                            '<i data-name="' + data.data.name + '" data-id="' + data.data._id + '" class="actions edit-nomgroup icon-menu"></i>' +
                                            '</a>'
                                    );
                                }, 350);
                            }
                        });
                    },
                    onClose: function(){

                    },
                    width: 600
                });

                app.sections.nomenclature.list.mc_add.open();
            });
        },

        editNomgroup: function($object){
            app.templates.render('nomenclature.edit.html', { name: $object.data('name') }, function(html){
                app.sections.nomenclature.list.mc_edit = new app.modal.ModalController({
                    title: 'Редактирование категории номернклатуры',
                    content: html,
                    onShow: function(controller){
                        new app.form.FormController({
                            form_selector: '#form-nomenclature-edit',
                            url: '/nomenclature/editnomgroup/' + $object.data('id'),
                            fields: { name: '#ne_name' },
                            messages: {
                                OK: 'Изменения сохранены',
                                NAME_DOES_NOT_MATCH_PATTERN: 'Наименование некоректно',
                                DUBLICATE_NAME_FOUND: 'Категория с таким названием уже существует',
                                NAME_EMPTY: 'Не введено название'
                            },
                            onSuccess: function(data){
                                setTimeout(function(){
                                    controller.close();

                                    var $item = $('.side-menu a[data-id="' + data.data._id + '"]');

                                    $item.find('.nomgroup-name').html(data.data.name);
                                    $item.find('i.edit-nomgroup').data('name', data.data.name);

                                    if(app.sections.nomenclature.list.nomgroup_id == data.data._id){
                                        $('#global-nomgroup-name').html(data.data.name);
                                    }
                                }, 350);
                            }
                        });

                        $('#delete-nomgroup').on('click', function(e){
                            e.preventDefault();

                            app.sections.nomenclature.list.deleteNomgroup([$object.data('id')], function(){
                                var $item = $('.side-menu a[data-id="' + $object.data('id') + '"]');

                                $item.slideUp(150, function(){
                                    $item.remove();
                                });

                                setTimeout(function(){
                                    app.sections.nomenclature.list.mc_edit.close();

                                    if(app.sections.nomenclature.list.nomgroup_id == $object.data('id')){
                                        document.location.href = '/nomenclature';
                                    }
                                }, 350);
                            });
                        });
                    },
                    onClose: function(){

                    },
                    width: 600
                });

                app.sections.nomenclature.list.mc_edit.open();
            });
        },

        deleteNomgroup: function(ids, done){
            $.ajax({
                url: '/nomenclature/deletenomgroups',
                data: {
                    ids: ids
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function(){
                    app.loading.setGlobalLoading('app.sections.nomenclature.nomgroups.delete');
                },
                success: function(data){
                    app.loading.unSetGlobalLoading('app.sections.nomenclature.nomgroups.delete');

                    if(data.success == true){
                        if(done){
                            done(ids);
                        }
                    }
                },
                error: function(){
                    app.loading.unSetGlobalLoading('app.sections.nomenclature.nomgroups.delete');
                }
            });
        },

        binds: function(){
            $('#add-nomgroup').on('click', function(e){
                e.preventDefault();
                app.sections.nomenclature.list.addNomgroup();
            });

            $('body').on('click.edit-nomgroup', '.edit-nomgroup', function(e){
                e.preventDefault();
                app.sections.nomenclature.list.editNomgroup($(this));
            });
        },

        init: function(nomgroup_id){
            this.nomgroup_id = nomgroup_id;
            this.binds();
        }
    }
};
app.sections.nomenclature = {
	delete: function(ids, done){
		$.ajax({
			url: '/nomenclature/delete',
			data: {
				ids: ids
			},
			type: 'post',
			dataType: 'json',
			beforeSend: function(){
				app.loading.setGlobalLoading('app.sections.nomenclature.delete');
			},
			success: function(data){
				app.loading.unSetGlobalLoading('app.sections.nomenclature.delete');

				if(data.success == true){
					if(done){
						done(ids);
					}
				}
			},
			error: function(){
				app.loading.unSetGlobalLoading('app.sections.nomenclature.delete');
			}
		});
	},

    selectItem: function(options){
        app.templates.render('nomenclature.select.html', {  }, function(html){
            app.sections.nomenclature.mc_select = new app.modal.ModalController({
                title: 'Выбор позиции из номенклатуры',
                content: html,
                onShow: function(controller){
					var selects = {
						nomgroups: [],
						nomenclatures: [],
						nomgroup: '0',
						item: null,

						drawNomgroups: function(){
							var html = '';

							html += '<option value="0">Все категории</option>';
							html += '<option value="freegroup">Без категории</option>';

							for(var i = 0, l = this.nomgroups.length; i < l; i++){
								html += '<option value="' + this.nomgroups[i]._id + '">' + this.nomgroups[i].name + '</option>';
							}

							$('#ns_nomgroup').html(html).chosen( app.chosen_options ).on('change', function(){
								selects.nomgroup = $(this).val();
								$('#ns_nomenclature').chosen('destroy');
								selects.drawNomenclatures();
							});
						},

						drawNomenclatures: function(){
							var html = '';

							for(var i = 0, l = this.nomenclatures.length; i < l; i++){
								var name = this.nomenclatures[i].name + ' (' + this.nomenclatures[i].article + ')';

								if(this.nomgroup == '0'){
									html += '<option value="' + this.nomenclatures[i]._id + '">' + name + '</option>';
								}else if(this.nomgroup == 'freegroup'){
									if(this.nomenclatures[i].nomgroup == null){
										html += '<option value="' + this.nomenclatures[i]._id + '">' + name + '</option>';
									}
								}else{
									if(this.nomenclatures[i].nomgroup && this.nomenclatures[i].nomgroup._id == this.nomgroup){
										html += '<option value="' + this.nomenclatures[i]._id + '">' + name + '</option>';
									}
								}
							}

							if(this.nomenclatures[0]){
								selects.item = this.nomenclatures[0]._id;
							}

							$('#ns_nomenclature').html(html).chosen( app.chosen_options ).on('change', function(){
								selects.item = $(this).val();
							});
						},

						getItemData: function(id){
							for(var i = 0, l = this.nomenclatures.length; i < l; i++){
								if(this.nomenclatures[i]._id == id){
									return this.nomenclatures[i];
								}
							}
						},

						processForm: function(){
							$('#form-nomenclature-select').on('submit', function(e){
								e.preventDefault();

								var $fm = $('#form-nomenclature-select .form-message');

								$fm.slideUp(200, function(){
									$fm.removeClass('success error').empty();

                                    if(selects.item){
                                        if(options.onSelect){
                                            $fm.addClass('success').html('Позиция выбрана').slideDown(200);

                                            setTimeout(function(){
                                                options.onSelect(selects.getItemData(selects.item));
                                                controller.close();
                                            }, 350);
                                        }
                                    }else{
                                        $fm.addClass('error').html('Не выбрана позиция').slideDown(200);
                                    }
								});
							});
						}
					};

					$.ajax({
						url: '/nomenclature/getnomgroups',
						type: 'POST',
						dataType: 'json',
						beforeSend: function(){
							controller.setLoading();
						},
						success: function(data){
							controller.unSetLoading();
							selects.nomgroups = data;
							selects.drawNomgroups();

							$.ajax({
								url: '/nomenclature/getnomenclature',
								type: 'POST',
								dataType: 'json',
								beforeSend: function(){
									controller.setLoading();
								},
								success: function(data){
									controller.unSetLoading();
									selects.nomenclatures = data;
									selects.drawNomenclatures();
									selects.processForm();
								}
							});
						}
					});
                },
                onClose: function(){

                },
                width: 500
            }).open();
        });
    },

    add: {
        binds: function(){
            $('.view-invoice').on('click', function(e){
                app.sections.accounts.viewDocument(false);
                e.preventDefault();
            });
        },

        init: function(nomgroup_id){
            this.form_controller = new app.form.FormController({
                form_selector: '#form-add-nomenclature',
                url: '/nomenclature/add',
                fields: {
                    name: '#name',
                    article: '#article',
                    price: '#price',
                    unit: '#unit',
                    nomgroup: '#nomgroup'
                },
                messages: {
                    OK: 'Позиция создана',
                    NAME_DOES_NOT_MATCH_PATTERN: 'Некорректное наименование',
                    NAME_EMPTY: 'Не введено наименование',
                    DUBLICATE_NAME_FOUND: 'Позиция с таким наименованием уже существует',
                    PRICE_EMPTY: 'Не введена цена',
                    PRICE_DOES_NOT_MATCH_PATTERN: 'Некорректная цена',
                    ARTICLE_DOES_NOT_MATCH_PATTERN: 'Некорректный артикул',
                    ARTICLE_EMPTY: 'Не введен артикул',
                    DUBLICATE_ARTICLE_FOUND: 'Позиция с таким артикулом уже существует'
                },
                onSuccess: function(data){
                    if(data.data && data.data._id){
                        setTimeout(function(){
                            var root = '';

                            if(data.data.nomgroup){
                                root = '/nomenclature/' + data.data.nomgroup;
                            }else{
                                root = '/nomenclature';
                            }

                            document.location.href = root + '/edit/' + data.data._id;
                        }, 300);
                    }
                }
            });

            $('#name').focus();

            this.binds();
        }
    },

    edit: {
		delete: function(){
			if(confirm('Удалить позицию?')){
				app.sections.nomenclature.delete([this.id], function(ids){
					setTimeout(function(){
						document.location.href = app.sections.nomenclature.edit.root;
					}, 300);
				});
			}
		},

        binds: function(){
			var _this = this,
				$body = $('body');

			$body.on('click.action-delete', '.action-delete', function(e){
				_this.delete();
				e.preventDefault();
			});
        },

        init: function(nomgroup_id, id){
            this.id = id;
			this.nomgroup_id = nomgroup_id;
			this.root = '/nomenclature';

			if(nomgroup_id){
				this.root += '/' + nomgroup_id;
			}

            var _nmg_id = $('#nomgroup').val();

            this.form_controller = new app.form.FormController({
                form_selector: '#form-edit-nomenclature',
                url: '/nomenclature/edit/' + this.id,
                fields: {
                    name: '#name',
                    article: '#article',
                    price: '#price',
                    unit: '#unit',
                    nomgroup: '#nomgroup'
                },
                messages: {
                    OK: 'Изменения сохранены',
                    NAME_DOES_NOT_MATCH_PATTERN: 'Некорректное наименование',
                    NAME_EMPTY: 'Не введено наименование',
                    DUBLICATE_NAME_FOUND: 'Позиция с таким наименованием уже существует',
                    PRICE_EMPTY: 'Не введена цена',
                    PRICE_DOES_NOT_MATCH_PATTERN: 'Некорректная цена',
                    ARTICLE_DOES_NOT_MATCH_PATTERN: 'Некорректный артикул',
                    ARTICLE_EMPTY: 'Не введен артикул',
                    DUBLICATE_ARTICLE_FOUND: 'Позиция с таким артикулом уже существует'
                },
                onSuccess: function(data){
                    setTimeout(function(){
                        if(data.data.nomgroup != _nmg_id){
                            var root = '/nomenclature';

                            if(data.data.nomgroup){
                                root += '/' + data.data.nomgroup;
                            }

                            document.location.href = root + '/edit/' + data.data._id;
                        }else{
                            $('#item-name').html(data.data.name);
                        }
                    }, 350);
                }
            });

            $('#name').focus();

            this.binds();
        }
    },

    list: {
        all_selected: false,
        selected: [],

        selectAllToggle: function(){
            if($('.cb-all').prop('checked') === true){
                $('.cb-item').attr('checked', 'checked').prop('checked', true);
            }else{
                $('.cb-item').removeAttr('checked').prop('checked', false);
            }

            this.processCheckboxes();
        },

        processCheckboxes: function(){
            var _this = this;
            this.selected = [];

            $('.cb-item').each(function(){
                if($(this).prop('checked') === true){
                    _this.selected.push($(this).data('id'));
                }
            });

            if(this.selected.length > 0){
                $('.multi-action').addClass('show');
            } else {
                $('.multi-action').removeClass('show');
            }
        },

        addNomgroup: function(){
            app.templates.render('nomenclature.add.html', {  }, function(html){
                app.sections.nomenclature.list.mc_add = new app.modal.ModalController({
                    title: 'Создание категории',
                    content: html,
                    onShow: function(controller){
                        $('#na_name').focus();

                        new app.form.FormController({
                            from_modal: true,
                            modal_controller: controller,
                            form_selector: '#form-nomenclature-add',
                            url: '/nomenclature/addnomgroup',
                            fields: { name: '#na_name' },
                            messages: {
                                OK: 'Группа создана',
                                NAME_DOES_NOT_MATCH_PATTERN: 'Некорректное наименование',
                                NAME_EMPTY: 'Не введено наименование',
                                DUBLICATE_NAME_FOUND: 'Позиция с таким наименованием уже существует',
                                ARTICLE_DOES_NOT_MATCH_PATTERN: 'Некорректный артикул',
                                ARTICLE_EMPTY: 'Не введен артикул',
                                DUBLICATE_ARTICLE_FOUND: 'Позиция с таким артикулом уже существует'
                            },
                            onSuccess: function(data){
                                setTimeout(function(){
                                    controller.close();

                                    $('.side-menu .sorting').append(
                                        '<a data-id="' + data.data._id + '" href="/nomenclature/' + data.data._id + '">' +
                                            '<span class="nomgroup-name">' + data.data.name + '</span>' +
                                            '<i data-name="' + data.data.name + '" data-id="' + data.data._id + '" class="actions edit-nomgroup icon-menu"></i>' +
                                        '</a>'
                                    );

                                    if($('.side-menu .sorting a').length >= 1){
                                        $('.side-menu a').removeClass('last');

                                        $('.side-menu .sorting a:last').addClass('last');
                                    }
                                }, 350);
                            }
                        });
                    },
                    onClose: function(){

                    }
                });

                app.sections.nomenclature.list.mc_add.open();
            });
        },

        editNomgroup: function($object){
            app.templates.render('nomenclature.edit.html', { name: $object.data('name') }, function(html){
                app.sections.nomenclature.list.mc_edit = new app.modal.ModalController({
                    title: 'Редактирование категории',
                    content: html,
                    onShow: function(controller){
                        $('#ne_name').focus();

                        new app.form.FormController({
                            from_modal: true,
                            modal_controller: controller,
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
                                        $('#empty-nomgroup-name').html(data.data.name);
                                    }

                                    $('.nomgroup-link[data-id="' + data.data._id + '"]').html(data.data.name);
                                }, 350);
                            }
                        });

                        $('#delete-nomgroup').on('click', function(e){
                            e.preventDefault();

                            app.sections.nomenclature.list.deleteNomgroup([$object.data('id')], function(){
                                var $nomgroup_item = $('.side-menu a[data-id="' + $object.data('id') + '"]'),
                                    $item = $('.item-link[data-nomgroup_id="' + $object.data('id') + '"]');

                                $nomgroup_item.slideUp(150, function(){
                                    $nomgroup_item.remove();
                                });

                                setTimeout(function(){
                                    app.sections.nomenclature.list.mc_edit.close();

                                    if(app.sections.nomenclature.list.nomgroup_id == $object.data('id')){
                                        document.location.href = '/nomenclature';
                                    }else{
                                        $('.nomgroup-link[data-id="' + $object.data('id') + '"]').after('&mdash;').remove();
                                        $item.attr('href', '/nomenclature/edit/' + $item.data('id'));
                                    }
                                }, 350);
                            });
                        });
                    },
                    onClose: function(){

                    },
                    width: 500
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

                        if($('.side-menu .sorting a').length < 1){
                            $('.side-menu a').removeClass('last');

                            $('.side-menu .group a:last').addClass('last');
                        }
                    }
                },
                error: function(){
                    app.loading.unSetGlobalLoading('app.sections.nomenclature.nomgroups.delete');
                }
            });
        },

		delete: function(){
			if(confirm('Удалить выбранные позиции?')){
				app.sections.nomenclature.delete(this.selected, function(ids){
					var ids_selectors = '',
						$table = $('table.items-table');

					for(var i = 0, l = ids.length; i < l; i++){
						ids_selectors += 'tr[data-id="' + ids[i] + '"],';
					}

					ids_selectors = ids_selectors.substr(0, ids_selectors.length - 1);

					$table.find(ids_selectors).remove();

					if($table.find('tr').length <= 1){
						$('.table-container').hide();
						$('.table-empty').show();
					}

					$('.multi-action').removeClass('show');
				});
			}
		},

        nomgroupsSortUpdate: function(){
            var sortlist = [];

            $('.side-menu .sorting a').each(function(){
                sortlist.push($(this).data('id'));
            });

            $.ajax({
                url: '/nomenclature/nomgroupssortupdate',
                data: {
                    sortlist: sortlist
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function(){
                    app.loading.setGlobalLoading('app.sections.nomenclature.delete');
                },
                success: function(data){
                    app.loading.unSetGlobalLoading('app.sections.nomenclature.delete');
                },
                error: function(){
                    app.loading.unSetGlobalLoading('app.sections.nomenclature.delete');
                }
            });
        },

        bindNomgroupsSortable: function(){
            $('.side-menu .sorting').sortable({
                axis: 'y',
                distance: 5,
                placeholder: 'sortable-highlight',
                forcePlaceholderSize: true,
                revert: true,
                cursor: 'move',
                update: function(event, ui){
                    app.sections.nomenclature.list.nomgroupsSortUpdate();
                }
            });

            $('.side-menu').disableSelection();
        },

        binds: function(){
            var _this = this;

            $('.cb-all').on('change', function(){
                _this.selectAllToggle();
            });

            $('.cb-item').on('change', function(){
                _this.processCheckboxes();
            });

			$('#delete').on('click', function(e){
				_this.delete();
				e.preventDefault();
			});

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
            this.bindNomgroupsSortable();
        }
    }
};
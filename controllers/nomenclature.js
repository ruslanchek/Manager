module.exports = function (app, models) {
    this.findOne = function (user, id, nomgroup_id, done) {
        models.nomenclature.find({ _user_id: user._id, _id: id, _nomgroup_id: nomgroup_id }, function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data[0]) {
                return done(false, data[0]);
            }else{
                return done(true);
            }
        });
    };

    this.findItems = function (user, filters, done) {
        models.nomenclature.find( app.utils.extend(filters, { _user_id: user._id }), { _id: 1, name: 1, article: 1, unit: 1, price: 1, _nomgroup_id: 1 } ).sort({ name: 1 }).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                return done(false, data);
            }

            return done(false, false);
        });
    };

    this.validateInputs = function(data){
        if(!data.name || data.name == ''){
            return {
                success: false,
                message: 'NAME_EMPTY',
                fields: ['name']
            };
        }

        if (!app.utils.matchPatternStr(data.name, 'name')) {
            return {
                success: false,
                message: 'NAME_DOES_NOT_MATCH_PATTERN',
                fields: ['name']
            };
        }

        if(!data.article || data.article == ''){
            return {
                success: false,
                message: 'ARTICLE_EMPTY',
                fields: ['article']
            };
        }

        if (!app.utils.matchPatternStr(data.article, 'name')) {
            return {
                success: false,
                message: 'ARTICLE_DOES_NOT_MATCH_PATTERN',
                fields: ['article']
            };
        }

        if(!data.price || data.price == ''){
            return {
                success: false,
                message: 'PRICE_EMPTY',
                fields: ['price']
            };
        }

        if (!app.utils.matchPatternStr(data.price, 'float')) {
            return {
                success: false,
                message: 'PRICE_DOES_NOT_MATCH_PATTERN',
                fields: ['price']
            };
        }

        return true;
    };

    this.editItem = function(user, id, data, done){
        var validate = this.validateInputs(data);

        if(validate !== true){
            return done(validate);
        }

        models.nomenclature.findOne({ _user_id: user._id, name: data.name, article: data.article, _id: { $ne: id } }, function (err, nomenclature_data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if(nomenclature_data){
                if (nomenclature_data.name == data.name) {
                    return done({
                        success: false,
                        message: 'DUBLICATE_NAME_FOUND',
                        fields: ['number']
                    });
                }

                if (nomenclature_data.article == data.article) {
                    return done({
                        success: false,
                        message: 'DUBLICATE_ARCTICLE_FOUND',
                        fields: ['article']
                    });
                }
            }

            models.nomenclature.findOne({ _user_id: user._id, _id: id }, function (err, item) {
                if (err) {
                    app.log.error('findOne error', err);

                    return done({
                        success: false,
                        message: 'SERVER_ERROR'
                    });
                }

                if(!data._nomgroup_id || data._nomgroup_id == ''){
                    data._nomgroup_id = null;
                }

                item._user_id = user._id;
                item.name = data.name;
                item.article = data.article;
                item.unit = data.unit;
                item.price = data.price;
                item._nomgroup_id = data._nomgroup_id;

                item.save(function (err, data) {
                    if (err) {
                        app.log.error('Nomenclature edit error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    return done({
                        success: true,
                        message: 'OK',
                        data: data
                    });
                });
            });
        });
    };

    this.addItem = function(user, data, session, done){
        var validate = this.validateInputs(data);

        if(validate !== true){
            return done(validate);
        }

        models.nomenclature.findOne({ _user_id: user._id, name: data.name, article: data.article }, function (err, nomenclature_data) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if(nomenclature_data){
                if (nomenclature_data.name == data.name) {
                    return done({
                        success: false,
                        message: 'DUBLICATE_NAME_FOUND',
                        fields: ['number']
                    });
                }

                if (nomenclature_data.article == data.article) {
                    return done({
                        success: false,
                        message: 'DUBLICATE_ARCTICLE_FOUND',
                        fields: ['article']
                    });
                }
            }

            var new_item = new models.nomenclature();

            if(!data._nomgroup_id || data._nomgroup_id == ''){
                data._nomgroup_id = null;
            }

            new_item._user_id = user._id;
            new_item.name = data.name;
            new_item.article = data.article;
            new_item.price = data.price;
            new_item.unit = data.unit;
            new_item._nomgroup_id = data._nomgroup_id;

            new_item.save(function (err, nomenclature_data) {
                if (err) {
                    app.log.error('Nomenclature create error', err);

                    return done({
                        success: false,
                        message: 'SERVER_ERROR'
                    });
                }

                models.user.findOneAndUpdate({ _id: user._id }, { $inc: { mc_nomenclature: 1 } }, function(err, user_data){
                    if (err) {
                        app.log.error('findOne error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    if(session && session.passport && session.passport.user){
                        session.passport.user.mc_nomenclature = user_data.mc_nomenclature;
                        session.save();
                    }

                    return done({
                        success: true,
                        message: 'OK',
                        data: nomenclature_data
                    });
                });
            });
        });
    };

	this.deleteItems = function(user, ids, done){
		models.nomenclature.find({ _user_id: user._id, _id: { $in: ids } }, { _id: 1 }).exec(function (err, data) {
			if (err) {
				app.log.error('findOne error', err);

				return done({
					success: false,
					message: 'SERVER_ERROR'
				});
			}

			if (data) {
				for(var i = 0, l = data.length; i < l; i++){
					data[i].remove();
				}

				return done({
					success: true,
					message: 'OK'
				});
			}

			return done({
				success: false,
				message: 'SERVER_ERROR'
			});
		});
	};

    return this;
};
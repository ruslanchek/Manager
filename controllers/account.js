module.exports = function (app, models) {
    this.findItems = function (user, filters, done) {
        var filters_query = {
            _user_id: user._id
        };

        if(filters){
            if(filters.date_from || filters.date_to){
                filters_query.date = {};

                if(filters.date_from){
                    var from = app.utils.parseDate(filters.date_from);

                    filters_query.date.$gte = new Date(from.getFullYear(), from.getMonth(), from.getDate());
                }

                if(filters.date_to){
                    var to = app.utils.parseDate(filters.date_to);

                    to.setDate(to.getDate() + 1);

                    filters_query.date.$lt = new Date(to.getFullYear(), to.getMonth(), to.getDate());
                }
            }
        }

        models.account.find(filters_query, { _id: 1, number: 1, date: 1, sum: 1, status: 1 }).exec(function (err, data) {
            if (err) {
                app.log.error('findOne error', err);
                return done(err);
            }

            if (data) {
                data.sort(function(a, b) {
                    if (parseInt(a.number) < parseInt(b.number))
                        return 1;
                    if (parseInt(a.number) > parseInt(b.number))
                        return -1;
                    return 0;
                });

                return done(false, data);
            }

            return done(false, false);
        });
    };

    this.countAll = function(user, done){
        models.account.count({ _user_id: user._id }, function(err, data){
            if (err) {
                return done(data);
            }

            if (data) {
                return done(data);
            }

            return done(false);
        });
    };

    this.findOne = function (user, id, done) {
        models.account.find({ _user_id: user._id, _id: id }, function (err, data) {
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

    this.validateInputs = function(data){
        if(!data.number || data.number == ''){
            return {
                success: false,
                message: 'NUMBER_EMPTY',
                fields: ['number']
            };
        }

        if (!app.utils.matchPatternStr(data.number, 'name_min')) {
            return {
                success: false,
                message: 'NUMBER_DOES_NOT_MATCH_PATTERN',
                fields: ['number']
            };
        }

        if(!data.date || data.date == ''){
            return {
                success: false,
                message: 'DATE_EMPTY',
                fields: ['date']
            };
        }

        if (!app.utils.matchPatternStr(data.date, 'date')) {
            return {
                success: false,
                message: 'DATE_DOES_NOT_MATCH_PATTERN',
                fields: ['date']
            };
        }

        if(data.items){
            try{
                JSON.parse(decodeURIComponent(data.items));
            }catch(e){
                return {
                    success: false,
                    message: 'SERVER_ERROR'
                };
            }
        }

        return true;
    };

    this.editItem = function(user, id, data, done){
        var validate = this.validateInputs(data);

        if(this.validateInputs(data) !== true){
            return done(validate);
        }

        var items = [],
            count = 0,
            sum = 0;

        try{
            items = JSON.parse(decodeURIComponent(data.items));
            count = items.length;
            sum = 0;

            for(var i = 0; i < count; i++){
                sum = sum + parseFloat(items[i].price) * parseInt(items[i].count);
            }
        }catch(e){

        }

        models.account.findOne({ _user_id: user._id, number: data.number, _id: { $ne: id } }, function (err, item) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (item) {
                return done({
                    success: false,
                    message: 'DUBLICATE_NUMBER_FOUND',
                    fields: ['number']
                });
            }else{
                models.account.findOne({ _user_id: user._id, _id: id }, function (err, item) {
                    if (err) {
                        app.log.error('findOne error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    item.number     = data.number;
                    item.date       = app.utils.parseDate(data.date);
                    item.contractor = data.contractor;
                    item.comment    = data.comment;
                    item.status     = data.status;
                    item.items      = items;
                    item.sum        = sum;
                    item.count      = count;

                    item.save(function (err, data) {
                        if (err) {
                            app.log.error('Account create error', err);

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
            }
        });
    };

    this.addItem = function(user, data, session, done){
        var validate = this.validateInputs(data);

        if(this.validateInputs(data) !== true){
            return done(validate);
        }

        var items = [],
            count = 0,
            sum = 0;

        try{
            items = JSON.parse(decodeURIComponent(data.items));
            count = items.length;
            sum = 0;

            for(var i = 0; i < count; i++){
                sum = sum + parseFloat(items[i].price) * parseInt(items[i].count);
            }
        }catch(e){

        }

        models.account.findOne({ _user_id: user._id, number: data.number }, function (err, item) {
            if (err) {
                app.log.error('findOne error', err);

                return done({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (item) {
                return done({
                    success: false,
                    message: 'DUBLICATE_NUMBER_FOUND',
                    fields: ['number']
                });
            }else{
                var new_item = new models.account();

                new_item._user_id = user._id;
                new_item.number = data.number;
                new_item.date = app.utils.parseDate(data.date);
                new_item.contractor = data.contractor;
                new_item.comment = data.comment;
                new_item.status = data.status;
                new_item.items = items;
                new_item.sum = sum;
                new_item.count = count;

                new_item.save(function (err, account_data) {
                    if (err) {
                        app.log.error('Account create error', err);

                        return done({
                            success: false,
                            message: 'SERVER_ERROR'
                        });
                    }

                    models.user.findOneAndUpdate({ _id: user._id }, { $inc: { mc_account: 1 } }, function(err, user_data){
                        if (err) {
                            app.log.error('findOne error', err);

                            return done({
                                success: false,
                                message: 'SERVER_ERROR'
                            });
                        }

                        if(session && session.passport && session.passport.user){
                            session.passport.user.mc_account = user_data.mc_account;
                            session.save();
                        }

                        return done({
                            success: true,
                            message: 'OK',
                            data: account_data
                        });
                    });
                });
            }
        });
    };

    this.deleteItems = function(user, ids, done){
        models.account.find({ _user_id: user._id, _id: { $in: ids } }, { _id: 1 }).exec(function (err, data) {
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
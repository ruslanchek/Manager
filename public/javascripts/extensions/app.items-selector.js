app.items_selector = {
    ItemsSelectorController: function (options) {
        var _this = this;

        this.id = (Math.random() * 10).toString();

        this.options = {
            data: [],
            onChange: function(items){

            }
        };

        $.extend(this.options, options);

        this.$container = $(this.options.container_selector);

        if (this.$container.length <= 0) {
            return;
        }

        this.items = [];

        this.resetForm = function(){
            this.$container.find('.new-item-name').val('');
            this.$container.find('.new-item-price').val('');
            this.$container.find('.new-item-count').val(1);
            this.recountNewItem();
            this.$container.find('.new-item-name').focus();
        };

        this.addItem = function(item){
            var data = {},
                row_template = '<tr data-number="{{number}}" class="item-row">' +
                                    '<td>{{number}}</td>' +
                                    '<td>{{name}}</td>' +
                                    '<td><div class="price">{{price}}&nbsp;<span class="rub">&#8399;</span></div></td>' +
                                    '<td>{{count}}</td>' +
                                    '<td><div class="price">{{sum}}&nbsp;<span class="rub">&#8399;</span></div></td>' +
                                    '<td><a href="#" data-number="{{number}}" class="action-button warning delete-item" data-number="{{number}}" title="Удалить"><i class="icon-cancel"></i></a></td>' +
                                '</tr>';

            if(!item){
                var $name = this.$container.find('.new-item-name'),
                    $price = this.$container.find('.new-item-price'),
                    $count = this.$container.find('.new-item-count'),
                    error = false;

                $name.add($price).add($count).removeClass('input-error');

                data = {
                        name    : $name.val(),
                        price   : parseFloat($price.val()),
                        count   : parseInt($count.val()),
                        number  : this.items.length + 1
                    };

                if(!data.name || data.name == ''){
                    $name.addClass('input-error');
                    error = true;
                }

                if(!data.price || data.price <= 0){
                    $price.addClass('input-error');
                    error = true;
                }

                if(!data.count || data.count <= 0){
                    $count.addClass('input-error');
                    error = true;
                }

                this.$container.find('.input-error:first').focus();

                if(error === true){
                    return;
                }

                var html = app.templates.renderFromVar(row_template, {
                    number: data.number,
                    name: data.name,
                    price: app.utils.humanizePrice(data.price),
                    count: data.count,
                    sum: app.utils.humanizePrice(data.count * data.price)
                });

                this.$container.find('table tr.new-item-row').before(html);
                this.$container.find('.new-item-number').html(data.number + 1);

                var $row = this.$container.find('table tr[data-number="' + data.number + '"]');

                $row.find('.delete-item').on('click', function(e){
                    e.preventDefault();
                    _this.deleteItem(data.number);
                });

                this.items.push(data);
                this.totalRecount();
                this.resetForm();

                this.options.onChange(this.items);
            }else{
                data = {
                    name    : item.name,
                    price   : parseFloat(item.price),
                    count   : parseInt(item.count),
                    number  : item.number
                };

                this.items.push(data);

                var html = app.templates.renderFromVar(row_template, {
                    number: data.number,
                    name: data.name,
                    price: app.utils.humanizePrice(data.price),
                    count: data.count,
                    sum: app.utils.humanizePrice(data.count * data.price)
                });

                this.$container.find('table tr.new-item-row').before(html);
                this.$container.find('.new-item-number').html(this.items.length + 1);

                var $row = this.$container.find('table tr[data-number="' + (data.number) + '"]');

                $row.find('.delete-item').on('click', function(e){
                    e.preventDefault();
                    _this.deleteItem(data.number);
                });

                this.totalRecount();
                this.resetForm();
            }
        };

        this.renewNumbers = function(){
            var new_array = [];

            for(var i = 0, l = _this.items.length; i < l; i++){
                this.items[i].number = i + 1;
                new_array.push(this.items[i]);
            }

            this.items = new_array;

            this.$container.find('table tr.item-row').each(function(i){
                $(this).attr('data-number', i + 1).data('number', i + 1).find('td:first').html(i + 1);
                $(this).find('.delete-item').data('number', i + 1).attr('data-number', i + 1);
            });
        };

        this.deleteItem = function(number){
            var new_array = [];

            for(var i = 0, l = _this.items.length; i < l; i++){
                if(this.items[i].number != number){
                    new_array.push(this.items[i]);
                }
            }

            this.items = new_array;
            this.$container.find('table tr[data-number="' + number + '"]').remove();
            this.totalRecount();

            this.$container.find('.new-item-number').html(this.items.length + 1);
            this.renewNumbers();

            this.options.onChange(this.items);
        };

        this.getNewItemSum = function(){
            var price = parseFloat(this.$container.find('.new-item-price').val()),
                count = parseInt(this.$container.find('.new-item-count').val()),
                sum = parseFloat(price * count);

            if(!sum){
                sum = 0;
            }

            return sum;
        };

        this.recountNewItem = function(){
            this.$container.find('.new-item-sum').html(app.utils.humanizePrice(this.getNewItemSum()));
        };

        this.totalRecount = function(){
            var sum = 0;

            for(var i = 0, l = this.items.length; i < l; i++){
                sum += this.items[i].count * this.items[i].price;
            }

            _this.$container.find('.total-sum').html(app.utils.humanizePrice(sum));
        };

        this.drawByArray = function(){
            if(this.options.data && this.options.data.length > 0){
                for(var i = 0, l = this.options.data.length; i < l; i++){
                    this.addItem(this.options.data[i]);
                }
            }
        };

        this.generateHtml = function(){
            app.templates.render('items.selector.html', { }, function(html){
                _this.$container.html(html);

                new app.number.NumberController({
                    input_selector: '#new-item-count',
                    onChange: function(value){
                        _this.recountNewItem();
                    }
                });

                _this.nomenclature_controller = new app.nomenclature.NMWindowController({

                });

                _this.$container.find('.new-item-add').on('click', function(e){
                    e.preventDefault();
                    _this.addItem();
                });

                _this.$container.find('.new-item-price, .new-item-count').on('keyup.isre change.isre blur.isre focus.isre', function(){
                    _this.recountNewItem();
                });

                _this.$container.find('.new-item-name, .new-item-price, .new-item-count').on('keyup.err', function(){
                    $(this).removeClass('input-error');
                });

                _this.$container.find('.add-from-db').on('click', function(e){
                    e.preventDefault();
                    _this.nomenclature_controller.open();
                });

                _this.drawByArray();
            });
        };

        this.generateHtml();
    }
}
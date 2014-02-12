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
            this.$container.find('.new-item-unit').val('');
            this.$container.find('.new-item-nds').val('-1');
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
                                    '<td>{{unit}}</td>' +
                                    '<td>{{{nds}}}</td>' +
                                    '<td><div class="price">{{sum}}&nbsp;<span class="rub">&#8399;</span></div></td>' +
                                    '<td><a href="#" data-number="{{number}}" class="action-button warning delete-item" data-number="{{number}}" title="Удалить"><i class="icon-cancel"></i></a></td>' +
                                '</tr>';

            if(!item){
                var $name = this.$container.find('.new-item-name'),
                    $price = this.$container.find('.new-item-price'),
                    $count = this.$container.find('.new-item-count'),
                    $unit = this.$container.find('.new-item-unit'),
                    $nds = this.$container.find('.new-item-nds'),
                    error = false;

                $name.add($price).add($count).removeClass('input-error');

                data = {
                    name    : $name.val(),
                    price   : parseFloat($price.val()),
                    count   : parseInt($count.val()),
                    unit    : $unit.val(),
                    nds     : $nds.val(),
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

                if(!data.unit || data.unit == ''){
                    $unit.addClass('input-error');
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
                    unit: data.unit,
                    nds: (data.nds && data.nds >= 0) ? data.nds + '%' : '<span class="color-gray-light">Без НДС</span>',
                    sum: app.utils.humanizePrice(this.countNds(data.price, data.nds) * data.count)
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
                    unit    : item.unit,
                    nds     : item.nds,
                    number  : item.number
                };

                this.items.push(data);

                var html = app.templates.renderFromVar(row_template, {
                    number: data.number,
                    name: data.name,
                    price: app.utils.humanizePrice(data.price),
                    count: data.count,
                    unit: data.unit,
                    nds: (item.nds && item.nds >= 0) ? item.nds + '%' : '<span class="color-gray-light">Без НДС</span>',
                    sum: app.utils.humanizePrice(this.countNds(data.price, data.nds) * data.count)
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

        this.countNds = function(price, nds){
            var price = parseFloat(price),
                nds = parseFloat(nds),
                nds_converted = (price / 100) * ((nds > 0) ? nds : 0);

            return parseFloat(price + nds_converted);
        };

        this.getNewItemSum = function(){
            var price = parseFloat(this.$container.find('.new-item-price').val()),
                nds = this.$container.find('.new-item-nds').val(),
                count = parseInt(this.$container.find('.new-item-count').val()),
                sum = this.countNds(price, nds) * count;

            if(!sum){
                sum = 0;
            }

            return sum;
        };

        this.recountNewItem = function(){
            this.$container.find('.new-item-sum').html(app.utils.humanizePrice(this.getNewItemSum()));
        };

        this.totalRecount = function(){
            var total_sum = 0,
                total_nds = 0;

            for(var i = 0, l = this.items.length; i < l; i++){
                var price = parseFloat(this.items[i].price),
                    nds = this.items[i].nds,
                    count = parseInt(this.items[i].count),
                    nds_c = this.countNds(price, nds) * count,
                    sum = price * count;

                total_sum += sum;
                total_nds += nds_c - sum;
            }

            _this.$container.find('.total-sum').html(app.utils.humanizePrice(total_sum));
            _this.$container.find('.total-nds').html(app.utils.humanizePrice(total_nds));
            _this.$container.find('.total-sum-over').html(app.utils.humanizePrice(total_sum + total_nds));
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

                new app.field.FieldController({
                    input_selector: '.new-item-price',
                    types: [
                        { name: 'digits' }
                    ]
                });

                _this.$container.find('.new-item-add').on('click', function(e){
                    e.preventDefault();
                    _this.addItem();
                });

                _this.$container.find('.new-item-price, .new-item-count').on('keyup.isre change.isre blur.isre focus.isre', function(){
                    _this.recountNewItem();
                });

                _this.$container.find('.new-item-nds').on('change.isre', function(){
                    _this.recountNewItem();
                });

                _this.$container.find('.new-item-name, .new-item-price, .new-item-count, .new-item-unit').on('keyup.err', function(){
                    $(this).removeClass('input-error');
                });

                _this.$container.find('.add-from-db').on('click', function(e){
                    e.preventDefault();

                    app.sections.nomenclature.selectItem({
                        onSelect: function(data){
							if(data){
								_this.$container.find('.new-item-price').val(data.price);
                                _this.$container.find('.new-item-unit').val(data.unit);
								_this.$container.find('.new-item-name').val(data.name);
								_this.$container.find('.new-item-sum').html(app.utils.humanizePrice(_this.getNewItemSum()));
							}
                        }
                    });
                });

                $('.new-item-nds').chosen(app.chosen_options);

                _this.drawByArray();
            });
        };

        this.generateHtml();
    }
}
app.items_selector = {
    ItemsSelectorController: function (options) {
        var _this = this;

        this.id = (Math.random() * 10).toString();

        this.options = {

        };

        $.extend(this.options, options);

        this.$container = $(this.options.container_selector);

        if (this.$container.length <= 0) {
            return;
        }

        this.items = [];

        this.resetForm = function(){
            this.$container.find('.new-item-name').val('');
            this.$container.find('.new-item-price').val(0);
            this.$container.find('.new-item-count').val(1);
            this.recountNewItem();
            this.$container.find('.new-item-name').focus();
        };

        this.addItem = function(){
            var $name = this.$container.find('.new-item-name'),
                $price = this.$container.find('.new-item-price'),
                $count = this.$container.find('.new-item-count'),
                error = false;

            $name.add($price).add($count).removeClass('input-error');

            var data = {
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

            app.templates.render(
                'items.selector-row.html',
                {
                    number: data.number,
                    name: data.name,
                    price: app.utils.humanizePrice(data.price),
                    count: data.count,
                    sum: app.utils.humanizePrice(data.count * data.price)
                },
                function(html){
                    _this.$container.find('table tr.new-item-row').before(html);
                    _this.$container.find('.new-item-number').html(data.number + 1);

                    var $row = _this.$container.find('table tr[data-number="' + data.number + '"]');

                    $row.find('.delete-item').on('click', function(e){
                        e.preventDefault();

                        _this.deleteItem(data.number);
                    });

                    _this.items.push(data);
                    _this.totalRecount();
                    _this.resetForm();

                }
            );
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
            });
        };



        this.generateHtml();
    }
}
app.number = {
    NumberController: function (options) {
        var _this = this;

        this.id = (Math.random() * 10).toString();

        this.options = {
            minimum: 1,
            onChange: function(value){

            }
        };

        $.extend(this.options, options);

        this.$input = $(this.options.input_selector);

        if (this.$input.length <= 0) {
            return;
        }

        this.items = [];

        if (this.$input.length <= 0) {
            return;
        }

        this.$input.wrap('<div class="number-input"></div>');

        this.$input_wrapper = this.$input.parent();
        this.$input_wrapper.append('<div class="buttons"><a href="#" class="change-up"><i class="icon-down-dir"></i></a><a href="#" class="change-down"><i class="icon-up-dir"></i></a></div>');

        this.$up = this.$input_wrapper.find('.change-up');
        this.$down = this.$input_wrapper.find('.change-down');

        this.$down.on('click', function(e){
            _this.up();
            e.preventDefault();
        });

        this.$up.on('click', function(e){
            _this.down();
            e.preventDefault();
        });

        this.up = function(){
            var value = parseInt(this.$input.val());

            if(!value){
                value = 0;
            }

            value++;

            this.$input.val(value);
            this.options.onChange(value);
        }

        this.down = function(){
            var value = parseInt(this.$input.val());

            if(!value){
                value = 0;
            }

            value--;

            if(value < this.options.minimum){
                value = this.options.minimum;
            }

            this.$input.val(value);
            this.options.onChange(value);
        }
    }
}
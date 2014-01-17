app.nomenclature = {
    NMWindowController: function(options){
        var _this = this;

        this.id = (Math.random() * 10).toString();

        this.options = {
            onShow: function(controller){

            },
            onClose: function(){

            },
            onLoad: function(){

            },
            onSelectItem: function(){

            }
        };

        this.modal_controller = new app.modal.ModalController({
            title: 'Выбор позиции из номенклатуры',
            onShow: function(controller){

            },
            onClose: function(){

            },
            width: 600
        });

        this.open = function(){
            app.templates.render('nomenclature.select.html', {  }, function(html){
                _this.modal_controller.options.content = html;
                _this.modal_controller.open();
            });
        };
    }
}
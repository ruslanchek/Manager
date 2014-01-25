module.exports = function(app, controllers){
    var common = {
        utils: app.utils
    };

    /**
     * Get routes
     * */
    app.get('/', app.ensureAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            section: 'main',
            metadata: {
                title: 'Менеджер'
            }
        });

        res.render('main', params);
    });


    /**
     * Get routes
     * */
    app.get('/pdf', app.ensureAuthenticated, function(req, res){
        app.utils.generatePDF('<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="Content-type" content="text/html;charset=UTF-8"><link href="/stylesheets/kube/kube.css" rel="stylesheet"><link href="/stylesheets/blank.css" rel="stylesheet"></head><body><div class="blank-print"><p>Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате  обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате  обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.</p><h3>Образец заполнения платежного поручения</h3><table class="table table-bordered width-100"><tr><td width="25%">ИНН </td><td width="25%">КПП </td><td width="25%" rowspan="2" class="valign_bottom">Расчетный счет</td><td width="25%" rowspan="2" class="valign_bottom"></td></tr><tr><td colspan="2"><p><small>Получатель</small></p>ООО &laquo;&raquo;</td></tr><tr><td colspan="2" rowspan="2"><p><small>Банк получателя</small></p></td><td class="valign_bottom">БИК</td><td class="valign_bottom"></td></tr><tr><td class="valign_bottom">Корр. счет</td><td class="valign_bottom"></td></tr></table><h1>Счет №1 от 24.01.2014</h1><p>Поставщик:&nbsp;<strong>ООО &laquo;&raquo;</strong><br>Покупатель:<strong></strong></p><table class="table table-bordered width-100"><tr><th width="1%">№</th><th width="58%">Наименование</th><th width="20%">Цена</th><th width="1%">Количество</th><th width="20%">Сумма</th></tr></table><p>Всего ноль наименований на сумму 0,00 руб.<br><strong>Ноль рублей 00 копеек</strong></p></div></body></html>', res);
    });
};
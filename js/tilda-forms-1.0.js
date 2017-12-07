(function($){
    /* define user language */
    window.tildaBrowserLang = window.navigator.userLanguage || window.navigator.language;
    window.tildaBrowserLang = window.tildaBrowserLang.toUpperCase();
    if (window.tildaBrowserLang.indexOf('RU')!=-1){
        window.tildaBrowserLang = 'RU';
    } else {
        window.tildaBrowserLang = 'EN';
    }

    window.tildaForm = {
        isRecaptchaScriptInit: false,
        currentFormProccessing: false,
        arMessages: {
            'EN': {
                'success':'Thank you! Your data has been submitted.',
                'successorder':'Thank you! Order created. Checkout.'
            },
            'RU': {
                'success':'Спасибо! Данные успешно отправлены.',
                'successorder':'Спасибо! Заказ оформлен. Переходим к оплате...'
            }
        },
        arValidateErrors: {
            'EN': {
                'email':'Please put a correct e-mail',
                'url':'Please put a correct URL',
                'phone':'Please put a correct phone number',
                'number':'Please put a correct number',
                'date':'Please put a correct date',
                'time':'Please put a correct time (HH:mm)',
                'name':'Please put a name',
                'namerus':'Please put a correct name (only cyrillic letters)',
                'nameeng':'Please put a correct name (only latin letters)',
                'string':'You put incorrect symbols. Only letters, numbers and punctuation symbols are allowed',
                'req':'Please fill out all required fields',
                'reqfield': 'Required field',
                'emptyfill':'No one field is filled'
            },
            'RU': {
                'email':'Укажите, пожалуйста, корректный email',
                'url':'Укажите, пожалуйста, корректный URL',
                'phone':'Укажите, пожалуйста, корректный номер телефона',
                'number':'Укажите, пожалуйста, корректный номер',
                'date':'Укажите, пожалуйста, корректную дату',
                'time':'Укажите, пожалуйста, корректное время (ЧЧ:ММ)',
                'name':'Укажите, пожалуйста, имя',
                'namerus':'Укажите, пожалуйста, имя (только кириллица)',
                'nameeng':'Укажите, пожалуйста, имя (только латиница)',
                'string':'Вы написали некорректные символы. Разрешены только буквы, числа и знаки пунктуации',
                'req':'Пожалуйста, заполните все обязательные поля',
                'reqfield':'Обязательное поле',
                'emptyfill':'Ни одно поле не заполнено'
            }
        }
    };


    $(document).ready(function() {
        window.tildaForm.captchaCallback = function (token) {
            if (! window.tildaForm.currentFormProccessing || ! window.tildaForm.currentFormProccessing.form ) {
                return false;
            }

            window.tildaForm.send(window.tildaForm.currentFormProccessing.form, window.tildaForm.currentFormProccessing.btn, window.tildaForm.currentFormProccessing.formtype, window.tildaForm.currentFormProccessing.formskey);
            window.tildaForm.currentFormProccessing = false;
        }

        window.tildaForm.validate = function ($jform) {
            var arError = [];
            var isEmptyValue = true;
            $jform.find('.js-tilda-rule').each(function(){
                var req = $(this).data('tilda-req') || 0;
                var rule = $(this).data('tilda-rule') || 'none', regExp, str;
                var error = {};
                var val = $(this).val();
                var valnospace='';
                error.obj = $(this);
                error.type = [];

                if (val && val.length > 0) {
                    valnospace = val.replace(/\s/g,'');
                    val = val.trim();
                }

                if (val.length > 0) {
                    isEmptyValue = false;
                }

                if (
                    req == 1
                    && (
                        (val.length == 0 && valnospace.length == 0)
                        || (
                            ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio')
                            && $(this).closest('form').find('[name="'+$(this).attr('name')+'"]:checked').length==0
                        )
                    )
                ) {
                    error.type.push('req');
                } else {
                    switch(rule){
                        case 'email':
                            regExp = /^[a-zA-Zёа-яЁА-Я0-9_\.\-\+]{1,64}@[a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9][a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9\.\-]{0,253}\.[a-zA-Zёа-яЁА-Я]{2,10}$/;
                            if( val.length > 0 && !val.match( regExp ) ) {
                                error.type.push('email');
                            }
                            break;

                        case 'url':
                            regExp = /^((https?|ftp):\/\/)?[a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9][a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9\.\-]{0,253}\.[a-zA-Zёа-яЁА-Я]{2,10}\/?$/;
                            if( val.length > 0) {
                                str = val.split('//');
                                if (str && str.length > 1) {
                                    str = str[1];
                                } else {
                                    str = str[0];
                                }
                                str = str.split('/');
                                if (str && str.length > 0) {
                                    str = str[0];
                                } else {
                                    str = '';
                                }

                                if(! str.match( regExp ) ) {
                                    error.type.push('url');
                                }
                            }
                            break;

                        case 'phone':
                            regExp = /^[0-9\(\)\-\+]+$/gi;
                            if( valnospace.length > 0 && !valnospace.match( regExp ) ) {
                                error.type.push('phone');
                            } else {
                                str = valnospace.replace(/[^0-9]+/g,'');
                                if (
                                    str.indexOf('000') == 1
                                    || str.indexOf('111') == 1
                                    || str.indexOf('222') == 1
                                    || str.indexOf('333') == 1
                                    || str.indexOf('444') == 1
                                    || str.indexOf('555') == 1
                                    || str.indexOf('666') == 1
                                    || str.indexOf('777') == 1
                                    || str.indexOf('888') == 1
                                ) {
                                    error.type.push('phone');
                                }
                            }
                            break;

                        case 'number':
                            regExp = /^[0-9]+$/gi;
                            if( valnospace.length > 0 && !valnospace.match( regExp ) ) {
                                error.type.push('number');
                            }
                            break;

                        case 'date':
                            regExp = /^[0-9]{1,4}[\-\.\/][0-9]{1,2}[\-\.\/][0-9]{1,4}$/gi;
                            if( valnospace.length > 0 && !valnospace.match( regExp )) {
                                error.type.push('date');
                            }
                            break;

                        case 'time':
                            regExp = /^[0-9]{2}[:\.][0-9]{2}$/gi;
                            if( valnospace.length > 0 && !valnospace.match( regExp )) {
                                error.type.push('time');
                            }
                            break;

                        case 'name':
                            /* regExp = /^[\p{L}\p{M}][\p{L}\p{M}\'\-]{0,48}[\p{L}\p{M}]$/i;*/
                            regExp = /^([A-Za-zА-Яа-яЁёäöüÄÖÜßèéûҐґЄєІіЇї\s]{1,}((\-)?[A-Za-zА-Яа-яЁёäöüÄÖÜßèéûҐґЄєІіЇї\.\s](\')?){0,})*$/i;

                            if( val.length > 0 && !val.match( regExp ) ) {
                                error.type.push('name');
                            }
                            break;

                        case 'nameeng':
                            regExp = /^([A-Za-z\s]{1,}((\-)?[A-Za-z\.\s](\')?){0,})*$/i;

                            if( val.length > 0 && !val.match( regExp ) ) {
                                error.type.push('nameeng');
                            }
                            break;

                        case 'namerus':
                            regExp = /^([А-Яа-яЁё\s]{1,}((\-)?[А-Яа-яЁё\.\s](\')?){0,})*$/i;

                            if( val.length > 0 && !val.match( regExp ) ) {
                                error.type.push('namerus');
                            }
                            break;

                        case 'string':
                            regExp = /^[A-Za-zА-Яа-яЁёЁёäöüÄÖÜßèéû0-9,\.:;\"\'\`\-\_\+\?\!\%\$\@\*\&\^\s]$/i;

                            if( val.length > 0 && !val.match( regExp ) ) {
                                error.type.push('string');
                            }
                            break;

                        default:
                            break;
                    }
                }
                if (error.type && error.type.length > 0) {
                    arError[arError.length] = error;
                }
            });

            if (isEmptyValue && arError.length == 0) {
                arError = [{
                    'obj': 'none',
                    'type': ['emptyfill']
                }];
            }
            return arError;
        };

        window.tildaForm.hideErrors = function($jform) {
            $jform.find('.js-errorbox-all').hide();
            $jform.find('.js-rule-error').hide();
            $jform.find('.js-error-rule-all').html('');
            $jform.find('.js-successbox').hide();
            $jform.find('.js-error-control-box .t-input-error').html('');
            $jform.find('.js-error-control-box').removeClass('js-error-control-box');
            /*$(this).find('.js-form-spec-tilda-input').remove();*/
            $jform.removeClass('js-send-form-error');
            $jform.removeClass('js-send-form-success');
        };

        /* @return boolean show error if array arErrors is not empty and return true. If arErrors is empty then return false */
        window.tildaForm.showErrors = function($jform, arErrors) {
            if (! arErrors || arErrors.length == 0) {
                return false;
            }

            var clsInputBoxSelector = $jform.data('inputbox');
            if ( !clsInputBoxSelector ) {
                clsInputBoxSelector = '.blockinput';
            }
            var arLang = window.tildaForm.arValidateErrors[window.tildaBrowserLang] || {};
            var $fieldgroup, isFieldErrorBoxExist, isShowCommonErrors, $errItem, sError='';
            /*/$(this).find('.blockinput__errorbox').show().css({'display':'block'});*/
            for(var i=0; i<arErrors.length;i++) {
                if (!arErrors[i] || !arErrors[i].obj) { continue; }
                if (i==0 && arErrors[i].obj == 'none') {
                    $errItem = $jform.find('.js-rule-error-all');
                    $errItem.html(arLang['emptyfill']);
                    $errItem.css('display','block').show();
                    break;
                }

                $fieldgroup = arErrors[i].obj.closest(clsInputBoxSelector).addClass('js-error-control-box')
                isFieldErrorBoxExist = 0;
                isShowCommonErrors = 1;

                if ($fieldgroup.find('.t-input-error').length > 0) {
                    isFieldErrorBoxExist = 1;
                }
                for(j=0;j<arErrors[i].type.length;j++) {
                    error = arErrors[i].type[j];

                    sError = '';
                    if (isShowCommonErrors == 1) {
                        $errItem = $jform.find('.js-rule-error-'+error);
                        if ($errItem.length > 0){
                            if ($errItem.text() == '' && arLang[error]>'') {
                                $errItem.html(arLang[error]);
                            } else {
                                sError = $errItem.eq(0).text();
                            }
                            $errItem.css('display','block').show();
                        } else {
                            if (arLang[error]>'') {
                                $errItem = $jform.find('.js-rule-error-all');
                                if ($errItem && $errItem.length > 0) {
                                    $errItem.html(arLang[error]);
                                    $errItem.css('display','block').show();
                                }
                            }
                        }
                    }

                    if (isFieldErrorBoxExist) {
                        if (sError == '') {
                            if (arLang[error+'field']>'') {
                                sError = arLang[error+'field'];
                            } else {
                                if (arLang[error]>'') {
                                    sError = arLang[error];
                                }
                            }
                        }
                        if (sError > '') {
                            $fieldgroup.find('.t-input-error').html(sError);
                        }
                    }

                }
            }
            $jform.find('.js-errorbox-all').css('display','block').show();

            $jform.trigger('tildaform:aftererror');
            return true;
        };

        /* добавляем поля в форму сигнализирующие о необходимости создать заказ */
        window.tildaForm.addPaymentInfoToForm = function ($jform) {
            /* var successcallback = $jform.data('success-callback');
            $jform.data('success-callback-after',successcallback);

            запускаем оплату
            //$jform.data('success-callback', 'window.tildaForm.payment');
            */

            $jform.find('.js-tilda-payment').remove();

            var product,i,j,html = '';

            if (window.tcart.currency && window.tcart.currency > '') {
                html += '<input type="hidden" name="tildapayment[currency]" value="'+window.tcart.currency+'" class="js-tilda-payment">';
            }
            html += '<input type="hidden" name="tildapayment[amount]" value="'+window.tcart.amount+'" class="js-tilda-payment js-tilda-price">';
            if (window.tcart.system && window.tcart.system > '') {
                html += '<input type="hidden" name="tildapayment[system]" value="'+window.tcart.system+'" class="js-tilda-payment">';
            } else {
                html += '<input type="hidden" name="tildapayment[system]" value="auto" class="js-tilda-payment">';
            }
            for (i in window.tcart.products) {
                product = window.tcart.products[i];
                for (j in product) {
                    if (j == 'options') {
                        for (var o in product[j]) {
                            if (product[j][o]['option']) {
                                html += '<input type="hidden" name="tildapayment[products]['+i+']['+j+']['+o+'][option]" value="'+product[j][o]['option']+'" class="js-tilda-payment">';
                            }
                            if (product[j][o]['price'] && product[j][o]['price'] > 0) {
                                html += '<input type="hidden" name="tildapayment[products]['+i+']['+j+']['+o+'][price]" value="'+product[j][o]['price']+'" class="js-tilda-payment">';
                            }
                            if (product[j][o]['variant']) {
                                html += '<input type="hidden" name="tildapayment[products]['+i+']['+j+']['+o+'][variant]" value="'+product[j][o]['variant']+'" class="js-tilda-payment">';
                            }

                        }
                    } else {
                        html += '<input type="hidden" name="tildapayment[products]['+i+']['+j+']" value="'+product[j]+'" class="js-tilda-payment">';
                    }
                }
                /* html2 += '<div class="js-tilda-payment"><span class="productname">'+product['name']+'</span> <span class="productprice">'+product['amount']+'</span><div>'; */
            }
            $jform.append(html);

            /*
            var $productbox = $jform.find('js-product-box');
            if (! $productbox || $productbox.length == 0) {
                $jform.prepend('<div class="js-product-box">'+html2+'</div>');
            } else {
                $productbox.html(html2);
            }
            */
        }


        /* отправляемся на оплату после отправки данных на сервер форм */
        window.tildaForm.payment = function($jform, arNext) {
            var html = '';
            /*
            var virtPage = '/tilda/payment/'+$jform.attr('id')+'/start/';
            var virtTitle = 'Send data from form '+$jform.attr('id') + ' to payment system';
            if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
                Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
            }
            */
            window.tcart = {
                amount:0,
                currency: '',
                system: '',
                products: []
            };

            if ($jform.data('formpaymentoff') == 'y') {
                window.tcart.system = 'none';
                return ;
            }

            if ($jform.find('.js-successbox').length > 0) {
                if ($jform.find('.js-successbox').text() > '') {
                    $jform.data('successmessage', $jform.find('.js-successbox').text());
                }

                var arMessage = window.tildaForm.arMessages[window.tildaBrowserLang] || {};
                if (arMessage['successorder']) {
                    $jform.find('.js-successbox').html(arMessage['successorder']);
                }
                $jform.find('.js-successbox').show();
            }
            $jform.addClass('js-send-form-success');

            if (arNext.type == 'link') {
                window.location.href=arNext.value;
                return true;
            } else {
                if (arNext.type == 'form') {
                    $('#js-tilda-payment-formid').remove();
                    var key = '', val='';
                    html = '<form id="js-tilda-payment-formid" action="'+arNext.value.action+'" method="post"  style="position:absolue;opacity:0;width: 1px; height: 1px; left: -5000px;">';
                    arNext.value.action = '';
                    for (key in arNext.value) {
                        val = arNext.value[key];
                        if (val > '') {
                            html += "<input type='hidden' name='"+key+"' value='"+val+"' >";
                        }
                    }
                    html += '</form>';
                    $('body').append(html);
                    $('#js-tilda-payment-formid').submit();

                } else {
                    if (arNext.type == 'function') {
                        var arArgs = arNext.value.args;
                        eval(arNext.value.name+'($jform, arArgs);');
                        return false;
                    }
                }
            }

        };

        window.tildaForm.stripeLoad = function(){
            if (window.stripeapiiscalled!==true){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://checkout.stripe.com/checkout.js";
                document.body.appendChild(script);
                window.stripeapiiscalled=true;
            }
        };

        window.tildaForm.stripePay = function($jform, arArgs){
            if (window.stripeapiiscalled!==true){
                window.tildaForm.stripeLoad();
                window.setTimeout(function() {
                        window.tildaForm.stripePay($jform, arArgs);
                    },
                    200
                );
                return false;
            }

            var companyname = arArgs.companyname;
            var companylogo = arArgs.companylogo;

            if (! companyname) {
                companyname = window.location.host;
            }

            if(! window.stripehandler) {
                if (typeof window.StripeCheckout != 'object') {
                    window.setTimeout(function() {
                            window.tildaForm.stripePay($jform, arArgs);
                        },
                        200
                    );
                    return false;
                }
                window.stripehandler = window.StripeCheckout.configure({
                    key: arArgs.accountid,
                    image: companylogo,
                    name: companyname,
                    locale: 'auto'
                });

                /* Close Checkout on page navigation:*/
                $(window).on('popstate', function() {
                    window.stripehandler.close();
                });
            }

            window.stripehandler.open({
                name: companyname,
                image: companylogo,
                description: arArgs.description,
                amount:  parseInt(parseFloat(arArgs.amount)*100),
                currency: arArgs.currency,
                shippingAddress: arArgs.shipping == '1' ? true : false,
                email: arArgs.email > '' ? arArgs.email : '',
                token: function(token, args) {
                    if (token && token.id) {
                        $.ajax({
                            type: "POST",
                            url: 'https://forms.tildacdn.com/payment/stripe/',
                            data: {
                                projectid: arArgs.projectid,
                                invoiceid: arArgs.invoiceid,
                                token: token.id,
                                email: token.email,
                                currency: arArgs.currency,
                                amount:  parseInt(parseFloat(arArgs.amount)*100)
                            },
                            dataType : "json",
                            success: function(json){

                                //действие при успешной оплате
                                var virtPage = '/tilda/'+$jform.attr('id')+'/payment/';
                                var virtTitle = 'Pay order in form '+$jform.attr('id');
                                var virtPrice = arArgs.amount;
                                var virtProduct = arArgs.description;
                                if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
                                    Tilda.sendEventToStatistics(virtPage, virtTitle, virtProduct, virtPrice);
                                }

                                if (arArgs.successurl > '') {
                                    window.setTimeout(function(){
                                        window.location.href = arArgs.successurl;
                                    },300);
                                }
                                if ($jform.data('successmessage') > '') {
                                    $jform.find('.js-successbox').html($jform.data('successmessage'));
                                } else {
                                    $jform.find('.js-successbox').html('');
                                }
                                $jform.data('successmessage', '');

                                var successcallback = $jform.data('success-callback');

                                window.tcart = {
                                    amount:0,
                                    currency: '',
                                    system: '',
                                    products: []
                                };

                                window.tildaForm.successEnd ($jform, arArgs.successurl, successcallback);
                                $jform.trigger('tildaform:aftersuccess');
                            },
                            fail: function() {
                            },
                            timeout: 15*1000
                        });
                    }
                }

            });

        };

        window.tildaForm.cloudpaymentLoad = function(){
            if (window.cloudpaymentsapiiscalled!==true){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://widget.cloudpayments.ru/bundles/cloudpayments";
                document.body.appendChild(script);
                window.cloudpaymentsapiiscalled=true;
            }
        };

        window.tildaForm.cloudpaymentPay = function($jform, arArgs){
            if (window.cloudpaymentsapiiscalled!==true){
                window.tildaForm.cloudpaymentLoad();
                window.setTimeout(function() {
                        window.tildaForm.cloudpaymentPay($jform, arArgs);
                    },
                    200
                );
                return false;
            }

            var currency = arArgs.currency;
            var language = arArgs.language;
            if (! language ) {
                language = (currency == 'RUB' || currency == 'BYR' ? 'ru-RU' : 'en-US');
            }
            if(! window.cloudpaymentshandler) {
                if (typeof window.cp != 'object') {
                    window.setTimeout(function() {
                            window.tildaForm.cloudpaymentPay($jform, arArgs);
                        },
                        200
                    );
                    return false;
                }
                window.cloudpaymentshandler = new cp.CloudPayments({language: language});
            }

            var arData = {};
            arData.projectid = arArgs.projectid;
            if (arArgs.cloudPayments &&
                (
                    arArgs.cloudPayments.recurrent
                    || arArgs.cloudPayments.customerReceipt
                )
            ) {
                arData.cloudPayments = arArgs.cloudPayments;
            }

            var $jpopup = $jform.closest('.t-popup_show');
            if (!$jpopup || $jpopup.length == 0) {
                $jpopup = $jform.closest('.t706__cartwin_showed');
            }
            $jpopup.data('old-z-index', $jpopup.css('z-index'));
            $jpopup.css('z-index','auto');

            window.cloudpaymentshandler.charge(
                {
                    publicId: arArgs.publicId,
                    description: arArgs.description,
                    amount: parseFloat(arArgs.amount),
                    currency: currency,
                    accountId: arArgs.accountId,
                    invoiceId: arArgs.invoiceId,
                    email: arArgs.email,
                    data: arData
                },
                function (options) { /* success*/
                    $jpopup.css({'z-index':$jpopup.data('old-z-index')});

                    //действие при успешной оплате
                    var virtPage = '/tilda/'+$jform.attr('id')+'/payment/';
                    var virtTitle = 'Pay order in form '+$jform.attr('id');
                    var virtPrice = arArgs.amount;
                    var virtProduct = arArgs.description;
                    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
                        Tilda.sendEventToStatistics(virtPage, virtTitle, virtProduct, virtPrice);
                    }

                    if (arArgs.successurl > '') {
                        window.setTimeout(function(){
                            window.location.href = arArgs.successurl;
                        },300);
                    }
                    if ($jform.data('successmessage') > '') {
                        $jform.find('.js-successbox').html($jform.data('successmessage'));
                    } else {
                        $jform.find('.js-successbox').html('');
                    }
                    $jform.data('successmessage', '');

                    var successcallback = $jform.data('success-callback');

                    window.tcart = {
                        amount:0,
                        currency: '',
                        system: '',
                        products: []
                    };

                    window.tildaForm.successEnd ($jform, arArgs.successurl, successcallback);
                    $jform.trigger('tildaform:aftersuccess');

                },
                function (reason, options) { // fail
                    $jpopup.css({'z-index':$jpopup.data('old-z-index')});
                    $jform.find('.js-successbox').hide();
                    if ($jform.data('successmessage') > '') {
                        $jform.find('.js-successbox').html($jform.data('successmessage'));
                    } else {
                        $jform.find('.js-successbox').html('');
                    }
                    $jform.data('successmessage', '');

                    if (arArgs.failureurl > '') {
                      window.location.href = arArgs.failureurl;
                    }
                }
            );

            return false;
        };

        window.tildaForm.successEnd = function($jform, successurl, successcallback) {
            if ($jform.find('.js-successbox').length > 0) {
                if ($jform.find('.js-successbox').text() == '') {
                    var arMessage = window.tildaForm.arMessages[window.tildaBrowserLang] || {};
                    if (arMessage['success']) {
                        $jform.find('.js-successbox').html(arMessage['success']);
                    }
                }
                $jform.find('.js-successbox').show();
            }
            $jform.addClass('js-send-form-success');


            if (successcallback && successcallback.length > 0) {
                eval(successcallback+'($jform)');
            } else {
                if(successurl && successurl.length > 0) {
                    setTimeout(function(){
                        window.location.href= successurl;
                    },500);
                }
            }

            $jform.find('input[type=text]:visible').val('');
            $jform.find('textarea:visible').html('');
            $jform.find('textarea:visible').val('');
            $jform.data('tildaformresult', {tranid: "0", orderid: "0"});
        };

        window.tildaForm.send = function ($jform, btnformsubmit, formtype, formskey) {
            if ($jform.data('formcart') == 'y') {
                window.tildaForm.addPaymentInfoToForm($jform);
            }

            if (formtype==2 || (formtype==0 && formskey > '')) {

                var $inputElem;

                $inputElem = $jform.find('input[name=tildaspec-cookie]');
                if (! $inputElem || $inputElem.length == 0){
                    $jform.append('<input type="hidden" name="tildaspec-cookie" value="">');
                    $inputElem = $jform.find('input[name=tildaspec-cookie]');
                }
                if ($inputElem.length > 0) {
                    $inputElem.val(document.cookie);
                }

                $inputElem = $jform.find('input[name=tildaspec-referer]');
                if (!$inputElem || $inputElem.length == 0){
                    $jform.append('<input type="hidden" name="tildaspec-referer" value="">');
                    $inputElem = $jform.find('input[name=tildaspec-referer]');
                }
                if ($inputElem.length > 0) {
                    $inputElem.val(window.location.href);
                }

                $inputElem = $jform.find('input[name=tildaspec-formid]');
                if (!$inputElem || $inputElem.length == 0){
                    $jform.append('<input type="hidden" name="tildaspec-formid" value="">');
                    $inputElem = $jform.find('input[name=tildaspec-formid]');
                }
                if ($inputElem.length > 0) {
                    $inputElem.val($jform.attr('id'));
                }

                if (formskey > '') {
                    $inputElem = $jform.find('input[name=tildaspec-formskey]');
                    if (!$inputElem || $inputElem.length == 0){
                      $jform.append('<input type="hidden" name="tildaspec-formskey" value="">');
                      $inputElem = $jform.find('input[name=tildaspec-formskey]');
                    }
                    if ($inputElem.length > 0) {
                      $inputElem.val(formskey);
                    }
                }

                $inputElem = $jform.find('input[name=tildaspec-pageid]');
                if (!$inputElem || $inputElem.length == 0){
                    $jform.append('<input type="hidden" name="tildaspec-pageid" value="">');
                    $inputElem = $jform.find('input[name=tildaspec-pageid]');
                }
                if ($inputElem.length > 0) {
                    $inputElem.val($('#allrecords').data('tilda-page-id'));
                }

                $inputElem = $jform.find('input[name=tildaspec-projectid]');
                if (!$inputElem || $inputElem.length == 0){
                    $jform.append('<input type="hidden" name="tildaspec-projectid" value="">');
                    $inputElem = $jform.find('input[name=tildaspec-projectid]');
                }
                if ($inputElem.length > 0) {
                    $inputElem.val($('#allrecords').data('tilda-project-id'));
                }

                $jform.find('.js-form-spec-comments').val('');
                $formurl = 'https://forms.tildacdn.com/procces/';
                $.ajax({
                    type: "POST",
                    url: $formurl /*$(this).attr('action')*/,
                    data: $jform.serialize(),
                    dataType : "json",
                    success: function(json){
                        var successurl = $jform.data('success-url');
                        var successcallback = $jform.data('success-callback');
                        var formsendedcallback = $jform.data('formsended-callback');

                        btnformsubmit.removeClass('t-btn_sending');
                        btnformsubmit.data('form-sending-status','0');
                        btnformsubmit.data('submitform', '');

                        if(json && json.error) {
                            successurl = '';
                            successcallback = '';

                            var $errBox = $jform.find('.js-errorbox-all');
                            if(!$errBox || $errBox.length == 0) {
                                $jform.prepend('<div class="js-errorbox-all"></div>');
                                $errBox = $jform.find('.js-errorbox-all');
                            }

                            var $allError = $errBox.find('.js-rule-error-all');
                            if (!$allError || $allError.length == 0) {
                                $errBox.append('<p class="js-rule-error-all">'+json.error+'</p>');
                                $allError = $errBox.find('.js-rule-error-all');
                            }
                            $allError.html(json.error).show();
                            $errBox.show();

                            $jform.addClass('js-send-form-error');

                            $jform.trigger('tildaform:aftererror');
                        } else {
                            var formres = {};
                            if (json && json.results && json.results[0]) {
                                var str = json.results[0];
                                str = str.split(':');
                                formres.tranid = ''+str[0]+':'+str[1];
                                formres.orderid = (str[2] ? str[2] : '0');
                            } else {
                                formres.tranid = '0';
                                formres.orderid = '0';
                            }
                            $jform.data('tildaformresult', formres);


                            var virtPage = '/tilda/'+$jform.attr('id')+'/submitted/';
                            var virtTitle = 'Send data from form '+$jform.attr('id');
                            var virtPrice = 0;
                            var virtProduct = '';
                            if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
                                if ($jform.find('.js-tilda-price').length > 0 ) {
                                    virtPrice = $jform.find('.js-tilda-price').val();
                                    virtProduct = 'Order '+formres.orderid;
                                }
                                Tilda.sendEventToStatistics(virtPage, virtTitle, '', virtPrice);
                                if (window.dataLayer) {
                                    window.dataLayer.push({'event': 'submit_'+$jform.attr('id')});
                                }
                            } else {

                                if(typeof ga != 'undefined' && ga) {
                                    if (window.mainTracker != 'tilda') {
                                        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
                                    }
                                }

                                if (window.mainMetrika > '' && window[window.mainMetrika]) {
                                    window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
                                }

                                if (window.dataLayer) {
                                    window.dataLayer.push({'event': 'submit_'+$jform.attr('id')});
                                }
                            }

                            $jform.trigger('tildaform:aftersuccess');
                            if (formsendedcallback && formsendedcallback.length > 0) {
                                eval(formsendedcallback+'($jform);');
                            }

                            /* если нужно переслать данные дальше, в платежную систему */
                            if (json && json.next && json.next.type > '') {
                                var res = window.tildaForm.payment($jform, json.next);
                                successurl = '';
                                return false;
                            }

                            window.tildaForm.successEnd($jform, successurl, successcallback);
                        }
                    },
                    error: function(error) {

                        btnformsubmit.removeClass('t-btn_sending');
                        btnformsubmit.data('form-sending-status','0');
                        btnformsubmit.data('submitform', '');

                        var $errBox = $jform.find('.js-errorbox-all');
                        if(!$errBox || $errBox.length == 0) {
                            $jform.prepend('<div class="js-errorbox-all"></div>');
                            $errBox = $jform.find('.js-errorbox-all');
                        }

                        var $allError = $errBox.find('.js-rule-error-all');
                        if (!$allError || $allError.length == 0) {
                            $errBox.append('<p class="js-rule-error-all"></p>');
                            $allError = $errBox.find('.js-rule-error-all');
                        }
                        if (error && error.responseText>'') {
                            $allError.html(error.responseText+'. Please, try again later.');
                        } else {
                            if (error && error.statusText) {
                                $allError.html('Error ['+error.statusText+']. Please, try again later.');
                            }else {
                                $allError.html('Unknown error. Please, try again later.');
                            }
                        }
                        $allError.show();
                        $errBox.show();
                        $jform.addClass('js-send-form-error');

                        $jform.trigger('tildaform:aftererror');

                    },
                    timeout: 1000*15
                });

                return false;
            } else {
                if ($jform.data('is-formajax')=='y') {
                    $.ajax({
                        type: "POST",
                        url: $jform.attr('action'),
                        data: $jform.serialize(),
                        dataType : "text",
                        success: function(html) {
                            var json;
                            var successurl = $jform.data('success-url');
                            var successcallback = $jform.data('success-callback');

                            btnformsubmit.removeClass('t-btn_sending');
                            btnformsubmit.data('form-sending-status','0');
                            btnformsubmit.data('submitform', '');

                            if(html && html.length > 0){
                                if (html.substring(0,1)=='{') {
                                    if (window.JSON && window.JSON.parse) {
                                        json = window.JSON.parse(html);
                                    } else {
                                        json = $.parseJSON(html);
                                    }

                                    if (json && json.message) {
                                        if (json.message != 'OK') {
                                            $jform.find('.js-successbox').html(json.message);
                                        }
                                    } else {
                                        if (json && json.error) {
                                            var $errBox = $jform.find('.js-errorbox-all');
                                            if(!$errBox || $errBox.length == 0) {
                                                $jform.prepend('<div class="js-errorbox-all"></div>');
                                                $errBox = $jform.find('.js-errorbox-all');
                                            }

                                            var $allError = $errBox.find('.js-rule-error-all');
                                            if (!$allError || $allError.length == 0) {
                                                $errBox.append('<p class="js-rule-error-all">Unknown error. Please, try again later.</p>');
                                                $allError = $errBox.find('.js-rule-error-all');
                                            }
                                            $allError.html(json.error);
                                            $allError.show();
                                            $errBox.show();

                                            $jform.addClass('js-send-form-error');

                                            $jform.trigger('tildaform:aftererror');

                                            return false;
                                        }
                                    }
                                } else {
                                    $jform.find('.js-successbox').html(html);
                                }
                            }

                            if ($jform.find('.js-successbox').text() == '') {
                                var arMessage = window.tildaForm.arMessages[window.tildaBrowserLang] || {};
                                if (arMessage['success']) {
                                    $jform.find('.js-successbox').html(arMessage['success']);
                                }
                            }
                            $jform.find('.js-successbox').show();
                            $jform.find('input[type=text]:visible').val('');
                            $jform.find('textarea:visible').html('');
                            $jform.find('textarea:visible').val('');
                            $jform.addClass('js-send-form-success');

                            var virtPage = '/tilda/'+$jform.attr('id')+'/submitted/';
                            var virtTitle = 'Send data from form '+$jform.attr('id');

                            if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
                                window.Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
                            } else {
                                if(typeof ga != 'undefined') {
                                    if (window.mainTracker != 'tilda') {
                                        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
                                    }
                                }

                                if (window.mainMetrika > '' && window[window.mainMetrika]) {
                                    window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
                                }
                            }


                            if (successcallback && successcallback.length > 0) {
                                eval(successcallback+'($jform)');
                            } else {
                                if(successurl && successurl.length > 0) {
                                    setTimeout(function(){
                                        window.location.href= successurl;
                                    },500);
                                }
                            }

                            $jform.trigger('tildaform:aftersuccess');
                        },
                        error: function(error) {
                            btnformsubmit.removeClass('t-btn_sending');
                            btnformsubmit.data('form-sending-status','0');
                            btnformsubmit.data('submitform','');

                            var $errBox = $jform.find('.js-errorbox-all');
                            if(!$errBox || $errBox.length == 0) {
                                $jform.prepend('<div class="js-errorbox-all"></div>');
                                $errBox = $jform.find('.js-errorbox-all');
                            }

                            var $allError = $errBox.find('.js-rule-error-all');
                            if (!$allError || $allError.length == 0) {
                                $errBox.append('<p class="js-rule-error-all"></p>');
                                $allError = $errBox.find('.js-rule-error-all');
                            }
                            if (error && error.responseText>'') {
                                $allError.html(error.responseText+'. Please, try again later.');
                            } else {
                                if (error && error.statusText) {
                                    $allError.html('Error ['+error.statusText+']. Please, try again later.');
                                }else {
                                    $allError.html('Unknown error. Please, try again later.');
                                }
                            }
                            $allError.show();
                            $errBox.show();
                            $jform.addClass('js-send-form-error');

                            $jform.trigger('tildaform:aftererror');
                        },
                        timeout: 1000*15
                    });

                    event.preventDefault();
                    return false;
                } else {
                    //btnformsubmit.removeClass('t-btn_sending');
                    btnformsubmit.data('form-sending-status','3');
                    $jform.submit();
                    return true;
                }
            }
        };

        $('.js-tilda-captcha').each(function(){
            if ($(this).attr('data-tilda-captchakey') > '' ) {
                if (window.tildaForm.isRecaptchaScriptInit === false) {
                    window.tildaForm.isRecaptchaScriptInit = true;
                    $('head').append('<script src="https://www.google.com/recaptcha/api.js?render=explicit"'+' async defer><'+'/script>');
                    $('head').append('<style type="text/css">.js-send-form-success .grecaptcha-badge {display: none;}</style>');
                }
                var idform = $(this).attr('id');
                if ($('#'+idform+'recaptcha').length == 0) {
                    $(this).append('<div id="'+idform+'recaptcha" class="g-recaptcha" data-sitekey="'+$(this).attr('data-tilda-captchakey')+'" data-callback="window.tildaForm.captchaCallback" data-size="invisible"></div>');
                }
            } else {
                $(this).removeClass('js-tilda-captcha');
            }
        });

        $('.js-tilda-mask').each(function(){
            var mask = $(this).data('tilda-mask');
            var maskplaceholder = $(this).data('tilda-mask-holder');
            if (mask) {
                if (maskplaceholder && maskplaceholder > '') {
                    $(this).mask(''+mask, {placeholder: ''+maskplaceholder});
                } else {
                    $(this).mask(''+mask);
                }
            }
        });

        $('.js-tilda-rule').focus(function(){
            var str = $(this).attr('placeholder');
            if (str && str.length > 0) {
                $(this).data('placeholder', str);
                $(this).attr('placeholder', '');
            }
        });

        $('.js-tilda-rule').blur(function(){
            var str = $(this).data('placeholder');
            if (str > '') {
                $(this).attr('placeholder', str);
                $(this).data('placeholder', '');
            }
        });

        /* оставлено для совместимости со старыми блоками */
        window.validateForm = function($jform) {
            return window.tildaForm.validate($jform);
        }


        var $jallforms = $('.r').find('.js-form-proccess[data-formactiontype]');
        if ($jallforms.length > 0) {
            $jallforms.each(function() {
                if($(this).data('formactiontype') != 1) {
                    $(this).append('<div style="position: absolute; left: -5000px; bottom:0;"><input type="text" name="form-spec-comments" value="Its good" class="js-form-spec-comments"  tabindex="-1" /></div>');
                }
            });
        }

        $('.r').off('submit','.js-form-proccess');
        $('.r').on('submit','.js-form-proccess', function(){
            var btnformsubmit = $(this).find('[type=submit]');
            var btnstatus = btnformsubmit.data('form-sending-status');
            if(btnstatus && btnstatus == 3) {
                btnformsubmit.data('form-sending-status');
                return true;
            } else {
                $(this).find('[type=submit]').trigger('click');
                return false;
            }
        });

        $('.r').off('dblclick','.js-form-proccess [type=submit]');
        $('.r').off('click','.js-form-proccess [type=submit]');
        $('.r').on('click','.js-form-proccess [type=submit]', function(event) {
            event.preventDefault();

            var btnformsubmit = $(this);
            var btnstatus = btnformsubmit.data('form-sending-status');
            if (btnstatus >= '1') {
                /* 0 - могу отправлять, 1 - отправляю, как только отправлено снова в ставим в 0 */
                return false;
            }

            var $activeForm = $(this).closest('form'), arErrors=false;
            if ($activeForm.length == 0) {
                return false;
            }

            btnformsubmit.addClass('t-btn_sending');
            btnformsubmit.data('form-sending-status','1');
            btnformsubmit.data('submitform', $activeForm);

            window.tildaForm.hideErrors($activeForm);

            arErrors = window.tildaForm.validate($activeForm);

            if (window.tildaForm.showErrors($activeForm, arErrors)) {
                btnformsubmit.removeClass('t-btn_sending');
                btnformsubmit.data('form-sending-status','0');
                btnformsubmit.data('submitform','');
                return false;
            } else {
                var formtype = $activeForm.data('formactiontype');
                var formskey = $('#allrecords').data('tilda-formskey');

                if ($activeForm.find('.js-formaction-services').length == 0 && formtype != 1 && formskey == '') {
                    var $errBox = $activeForm.find('.js-errorbox-all');
                    if(!$errBox || $errBox.length == 0) {
                        $activeForm.prepend('<div class="js-errorbox-all"></div>');
                        $errBox = $activeForm.find('.js-errorbox-all');
                    }

                    var $allError = $errBox.find('.js-rule-error-all');
                    if (!$allError || $allError.length == 0) {
                        $errBox.append('<p class="js-rule-error-all">'+json.error+'</p>');
                        $allError = $errBox.find('.js-rule-error-all');
                    }
                    $allError.html('Please set reciever in block with forms').show();
                    $errBox.show();

                    $activeForm.addClass('js-send-form-error');
                    btnformsubmit.removeClass('t-btn_sending');
                    btnformsubmit.data('form-sending-status','0');
                    btnformsubmit.data('submitform','');

                    $activeForm.trigger('tildaform:aftererror');

                    return false;
                }

                if ($activeForm.find('.g-recaptcha').length > 0 && grecaptcha) {
                    window.tildaForm.currentFormProccessing = {
                        form: $activeForm,
                        btn: btnformsubmit,
                        formtype: formtype,
                        formskey: formskey
                    };

                    var captchaid = $activeForm.data('tilda-captcha-clientid');
                    if (captchaid === undefined || captchaid === '') {
                        var opts = {
                            size: 'invisible',
                            sitekey: $activeForm.data('tilda-captchakey'),
                            callback: window.tildaForm.captchaCallback
                        };
                        captchaid = grecaptcha.render($activeForm.attr('id')+'recaptcha', opts);
                        $activeForm.data('tilda-captcha-clientid', captchaid);
                    } else {
                        grecaptcha.reset(captchaid);
                    }
                    grecaptcha.execute(captchaid);
                    return false;
                }

                window.tildaForm.send($activeForm, btnformsubmit, formtype, formskey);
            }

            return false;
        });

        /* запоминанием utm-метки чтобы потом передать дальше */

        try {
            var TILDAPAGE_URL = window.location.href, TILDAPAGE_QUERY = '', TILDAPAGE_UTM='';
            if ( TILDAPAGE_URL.toLowerCase().indexOf('utm_') !== -1) {
                TILDAPAGE_URL = TILDAPAGE_URL.toLowerCase();
                TILDAPAGE_QUERY = TILDAPAGE_URL.split('?');
                TILDAPAGE_QUERY = TILDAPAGE_QUERY[1];
                if (typeof(TILDAPAGE_QUERY) == 'string') {
                    var arPair,i,arParams = TILDAPAGE_QUERY.split('&');
                    for(i in arParams) {
                        arPair = arParams[i].split('=');
                        if (arPair[0].substring(0,4) == 'utm_') {
                            TILDAPAGE_UTM = TILDAPAGE_UTM + arParams[i]+'|||';
                        }
                    }

                    if (TILDAPAGE_UTM.length > 0) {
                        var date = new Date()
                        date.setDate(date.getDate() + 30);
                        document.cookie = "TILDAUTM="+encodeURIComponent(TILDAPAGE_UTM)+"; path=/; expires=" + date.toUTCString();
                    }
                }

            }
        } catch(err) { }


    });

})(jQuery);


/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(factory) {
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : factory("object" == typeof exports ? require("jquery") : jQuery);
}(function($) {
    var caretTimeoutId, ua = navigator.userAgent, iPhone = /iphone/i.test(ua), chrome = /chrome/i.test(ua), android = /android/i.test(ua);
    $.mask = {
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: !0,
        dataName: "rawMaskFn",
        placeholder: "_"
    }, $.fn.extend({
        caret: function(begin, end) {
            var range;
            if (0 !== this.length && !this.is(":hidden")) return "number" == typeof begin ? (end = "number" == typeof end ? end : begin,
            this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(begin, end) : this.createTextRange && (range = this.createTextRange(),
                range.collapse(!0), range.moveEnd("character", end), range.moveStart("character", begin),
                range.select());
            })) : (this[0].setSelectionRange ? (begin = this[0].selectionStart, end = this[0].selectionEnd) : document.selection && document.selection.createRange && (range = document.selection.createRange(),
            begin = 0 - range.duplicate().moveStart("character", -1e5), end = begin + range.text.length),
            {
                begin: begin,
                end: end
            });
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        mask: function(mask, settings) {
            var input, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal;
            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName);
                return fn ? fn() : void 0;
            }
            return settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder,
                completed: null
            }, settings), defs = $.mask.definitions, tests = [], partialPosition = len = mask.length,
            firstNonMaskPos = null, $.each(mask.split(""), function(i, c) {
                "?" == c ? (len--, partialPosition = i) : defs[c] ? (tests.push(new RegExp(defs[c])),
                null === firstNonMaskPos && (firstNonMaskPos = tests.length - 1), partialPosition > i && (lastRequiredNonMaskPos = tests.length - 1)) : tests.push(null);
            }), this.trigger("unmask").each(function() {
                function tryFireCompleted() {
                    if (settings.completed) {
                        for (var i = firstNonMaskPos; lastRequiredNonMaskPos >= i; i++) if (tests[i] && buffer[i] === getPlaceholder(i)) return;
                        settings.completed.call(input);
                    }
                }
                function getPlaceholder(i) {
                    return settings.placeholder.charAt(i < settings.placeholder.length ? i : 0);
                }
                function seekNext(pos) {
                    for (;++pos < len && !tests[pos]; ) ;
                    return pos;
                }
                function seekPrev(pos) {
                    for (;--pos >= 0 && !tests[pos]; ) ;
                    return pos;
                }
                function shiftL(begin, end) {
                    var i, j;
                    if (!(0 > begin)) {
                        for (i = begin, j = seekNext(end); len > i; i++) if (tests[i]) {
                            if (!(len > j && tests[i].test(buffer[j]))) break;
                            buffer[i] = buffer[j], buffer[j] = getPlaceholder(j), j = seekNext(j);
                        }
                        writeBuffer(), input.caret(Math.max(firstNonMaskPos, begin));
                    }
                }
                function shiftR(pos) {
                    var i, c, j, t;
                    for (i = pos, c = getPlaceholder(pos); len > i; i++) if (tests[i]) {
                        if (j = seekNext(i), t = buffer[i], buffer[i] = c, !(len > j && tests[j].test(t))) break;
                        c = t;
                    }
                }
                function androidInputEvent() {
                    var curVal = input.val(), pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length) {
                        for (checkVal(!0); pos.begin > 0 && !tests[pos.begin - 1]; ) pos.begin--;
                        if (0 === pos.begin) for (;pos.begin < firstNonMaskPos && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    } else {
                        for (checkVal(!0); pos.begin < len && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    }
                    tryFireCompleted();
                }
                function blurEvent() {
                    checkVal(), input.val() != focusText && input.change();
                }
                function keydownEvent(e) {
                    if (!input.prop("readonly")) {
                        var pos, begin, end, k = e.which || e.keyCode;
                        oldVal = input.val(), 8 === k || 46 === k || iPhone && 127 === k ? (pos = input.caret(),
                        begin = pos.begin, end = pos.end, end - begin === 0 && (begin = 46 !== k ? seekPrev(begin) : end = seekNext(begin - 1),
                        end = 46 === k ? seekNext(end) : end), clearBuffer(begin, end), shiftL(begin, end - 1),
                        e.preventDefault()) : 13 === k ? blurEvent.call(this, e) : 27 === k && (input.val(focusText),
                        input.caret(0, checkVal()), e.preventDefault());
                    }
                }
                function keypressEvent(e) {
                    if (!input.prop("readonly")) {
                        var p, c, next, k = e.which || e.keyCode, pos = input.caret();
                        if (!(e.ctrlKey || e.altKey || e.metaKey || 32 > k) && k && 13 !== k) {
                            if (pos.end - pos.begin !== 0 && (clearBuffer(pos.begin, pos.end), shiftL(pos.begin, pos.end - 1)),
                            p = seekNext(pos.begin - 1), len > p && (c = String.fromCharCode(k), tests[p].test(c))) {
                                if (shiftR(p), buffer[p] = c, writeBuffer(), next = seekNext(p), android) {
                                    var proxy = function() {
                                        $.proxy($.fn.caret, input, next)();
                                    };
                                    setTimeout(proxy, 0);
                                } else input.caret(next);
                                pos.begin <= lastRequiredNonMaskPos && tryFireCompleted();
                            }
                            e.preventDefault();
                        }
                    }
                }
                function clearBuffer(start, end) {
                    var i;
                    for (i = start; end > i && len > i; i++) tests[i] && (buffer[i] = getPlaceholder(i));
                }
                function writeBuffer() {
                    input.val(buffer.join(""));
                }
                function checkVal(allow) {
                    var i, c, pos, test = input.val(), lastMatch = -1;
                    for (i = 0, pos = 0; len > i; i++) if (tests[i]) {
                        for (buffer[i] = getPlaceholder(i); pos++ < test.length; ) if (c = test.charAt(pos - 1),
                        tests[i].test(c)) {
                            buffer[i] = c, lastMatch = i;
                            break;
                        }
                        if (pos > test.length) {
                            clearBuffer(i + 1, len);
                            break;
                        }
                    } else buffer[i] === test.charAt(pos) && pos++, partialPosition > i && (lastMatch = i);
                    return allow ? writeBuffer() : partialPosition > lastMatch + 1 ? settings.autoclear || buffer.join("") === defaultBuffer ? (input.val() && input.val(""),
                    clearBuffer(0, len)) : writeBuffer() : (writeBuffer(), input.val(input.val().substring(0, lastMatch + 1))),
                    partialPosition ? i : firstNonMaskPos;
                }
                var input = $(this), buffer = $.map(mask.split(""), function(c, i) {
                    return "?" != c ? defs[c] ? getPlaceholder(i) : c : void 0;
                }), defaultBuffer = buffer.join(""), focusText = input.val();
                input.data($.mask.dataName, function() {
                    return $.map(buffer, function(c, i) {
                        return tests[i] && c != getPlaceholder(i) ? c : null;
                    }).join("");
                }), input.one("unmask", function() {
                    input.off(".mask").removeData($.mask.dataName);
                }).on("focus.mask", function() {
                    if (!input.prop("readonly")) {
                        clearTimeout(caretTimeoutId);
                        var pos;
                        focusText = input.val(), pos = checkVal(), caretTimeoutId = setTimeout(function() {
                            input.get(0) === document.activeElement && (writeBuffer(), pos == mask.replace("?", "").length ? input.caret(0, pos) : input.caret(pos));
                        }, 10);
                    }
                }).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function() {
                    input.prop("readonly") || setTimeout(function() {
                        var pos = checkVal(!0);
                        input.caret(pos), tryFireCompleted();
                    }, 0);
                }), chrome && android && input.off("input.mask").on("input.mask", androidInputEvent),
                checkVal();
            });
        }
    });
});

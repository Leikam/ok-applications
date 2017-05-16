console.log('init location: ', location);

var APP_NAME = serverConfig.appName;
var DOMAIN = serverConfig && serverConfig.domain || 'ok.ru';
var WIDGET_SERVER = serverConfig && serverConfig.widget_server || 'ok.ru';

OKSDK.init(appConf, init_success, init_failure);

function init_success() {
    console.info('Initialization success');

    getCurrentUserData(function (data) {
        var fragment = document.createDocumentFragment();
        var bold = document.createElement('B');
        var img = document.createElement('IMG');

        if (data) {
            img.src = data.pic_2;
            bold.appendChild(document.createTextNode(data.name));
            fragment.appendChild(img);
            fragment.appendChild(bold);
        }

        var heyoNode = document.getElementsByClassName('hello-div')[0];
        if (data) {
            heyoNode.innerHTML = '';
            heyoNode.appendChild(fragment);
        } else {
            heyoNode.innerHTML = 'Не удалось залогиниться';
        }

        var linkToFeed = document.getElementById('toFeed');
        if (data) {
            var linkSrc = 'http://' + DOMAIN + '/profile/' + data.uid;
            linkToFeed.href = linkSrc;
            linkToFeed.innerHTML = linkSrc;
            linkToFeed.style.display = '';
        } else {
            linkToFeed.style.display = 'none';
        }
    });

}
function init_failure() {
    console.error('Initialization failed', this);
}

function API_callback(method, result, data) {
    errorHandler(method, result, data);
    console.log("Global API callback.\nMethod[0]: %s,\n result[1]: %o,\n data[2]: %o", method, result, data);
}

function stub_callback(method, result, data) {
    errorHandler(method, result, data);
    console.log("Stub callback.\nMethod[0]: %s,\n result[1]: %o,\n data[2]: %o", method, result, data);
}

function callRestMethod(method, opts, callback) {
    OKSDK.REST.call(method, (opts || {}), (callback || stub_callback));
    console.log(method + ' called');
}

var content = document.getElementsByClassName('content')[0],
    targetWindow,
    locationObj = {};

var clickHandlersRegister = {
    testAnyFunc: function (e) {

    },
    oauthme: function () {
        var query = '';
        query += appConf.widget_server +'oauth/authorize' +
            '?client_id=' + appConf.app_id +
            '&scope=' + (appConf.oauth.scope || 'VALUABLE_ACCESS') +
            '&response_type=token' +
            '&show_permissions=on' +
            // параметр ?oauth_popup=on является якорем для логики обработки редиректов на ту же страницу
            '&redirect_uri=' + location.origin + location.pathname + '?oauth_popup=on' +
            '&layout=' + (appConf.oauth.layout || 'a') +
            '&state=' + (appConf.oauth.state || '');

        var popupConf = {
            w: 600,
            h: 300,
            l: (window.outerWidth - this.w) / 2,
            t: 0
        };
        var target = window.open(query, 'авторизация', 'left=100, top=0, width=600, height=450');
        console.log(query);
    },
    loginMe: function () {
        //var config = {
        //    user_name: 'lapynow.d@gmail.com', password: prompt('Давай пароль', '')
        //};
        //
        //callRestMethod('auth.login', config);
        callRestMethod('auth.touchSession');
    },
    logout: function () {
        OKSDK.REST.call('auth.expireSession', {}, function (method, result, data) {
            if (method == 'ok') {
                OKSDK.init(appConf, init_success, init_failure);
            }
        });
        //OKSDK.REST.call('auth.logoutAll', {}, stub_callback); // PERMISSION_DENIED : This method is allowed for internal applications only
    },
    requestPayment: function (e) {
        var opts = {
            //mob_pay_url: 'paymentnew.ok.ru'
        };
        OKSDK.Payment.show("Banana", "200", "777", opts);
    },
    postingFeed: function (e) {
        var attachment = {
            media: [{
                type: 'text',
                text: 'Mock test for posting. Stamp: ' + Date.now()
            }]
        };
        var popupConfig = {
            name: "demo_title",
            width: 600,
            height: 500,
            options: 'status=0, menubar=0'
        };
        var params = {
            attachment: JSON.stringify(attachment),
            //attachment: btoa(unescape(encodeURIComponent(OKSDK.toString(attachment)))),
            return: location.origin + '/'+ APP_NAME +'/return.html',
            popup: 'off',
            utext: 'on',
            silent: 'off',
            popupConfig: popupConfig
        };

         //by REST
        //OKSDK.REST.call('mediatopic.post', params,  stub_callback);

        // by shortcuts
        //OKSDK.Widgets.post(null, params);

        // by ui
        //OKSDK.invokeUIMethod('postMediatopic', JSON.stringify(attachment));

        // by method contructor
        var postMediatopc = new OKSDK.MethodConstructor('WidgetMediatopicPost', params);
        postMediatopc.run();

    },
    askPermissions: function (e) {
        var method = new OKSDK.MethodConstructor(
            'OAuth2Permissions',
            {
                client_id: appConf.app_id,
                redirect_uri: location.origin + "/" + APP_NAME + "/return.html",
                response_type: 'token',
                scope: appConf.oauth.scope,
                show_permissions: true
            }
        );
        method.run();
    },
    requestChatPermission: function () {
        var method = new OKSDK.MethodConstructor(
            'WidgetGroupAppPermissions',
            {
                client_id: appConf.app_id,
                redirect_uri: location.origin + "/" + APP_NAME + "/return.html",
                response_type: 'token',
                scope: appConf.group.scopeMap.GROUP_BOT_API_TOKEN
            }
        );
        method.run();
    },
    requestPostingPermission: function () {
        var method = new OKSDK.MethodConstructor(
            'WidgetGroupAppPermissions',
            {
                client_id: appConf.app_id,
                redirect_uri: location.origin + "/" + APP_NAME + "/return.html",
                response_type: 'token',
                scope: appConf.group.scopeMap.MESSAGES_FROM_GROUP,
                popupConfig: {
                    name: "demo_title",
                    width: 600,
                    height: 300,
                    options: 'status=0, menubar=0'
                }
            }
        );
        method.run();
    },
    requestAllGroupPermissions: function () {
        var method = new OKSDK.MethodConstructor(
            'WidgetGroupAppPermissions',
            {
                client_id: appConf.app_id,
                redirect_uri: location.origin + "/" + APP_NAME + "/return.html",
                response_type: 'token',
                scope: appConf.group.scope
            }
        );
        method.run();
    },
    aboutGroup: function (e) {
        OKSDK.REST.call('group.getInfo', {
            uids: 54423259185266,
            fields: ['name', 'PIC_AVATAR', 'access_type']
        }, API_callback)
    },
    whoami: function (e) {
        getCurrentUserData(
            function (data) {
                if (data) {
                    var result = '';
                    var fragment = document.createDocumentFragment();
                    for (var k in data) {
                        var dataElement = data[k];
                        if (k.indexOf('pic_') > -1) {
                            var img = document.createElement('IMG');
                            img.src = dataElement;
                            fragment.appendChild(img);
                            continue;
                        }
                        result += k + ": " + dataElement + ";\f\n";
                    }

                    content.appendChild(document.createTextNode(result));
                    content.appendChild(fragment);
                }
                console.log('users.getCurrentUser', arguments);
            }
        );
    },
    openWindow: function (e) {
        var elem = document.getElementById('openWindowData');
        window.name = 'parent';
        targetWindow = window.open(('./'+elem.value+'.html') || '/');
    }
};



/* Пример обработки авторизации на основной странице */
window.addEventListener('message', function (e) {
    console.log('-> Message received: ', e.data);
    var data = e.data;
    if (data) {
        var event = data.event;
        if (event) {
            // если виджет открыали в леере, то убираем его с дома
            if (event === 'returned') {
                document.body.removeChild(document.getElementsByClassName('ok-sdk-frame')[0]);
            }
        // проверка на запрос авторизации
        } else if (data.indexOf && data.indexOf('access_token=') > -1) {
            console.log('-> Relogin.');
            location.hash = data;
            OKSDK.init(appConf, init_success, init_failure);
        }
    }
}, false);

/* Эта страница была открыта в окне или табе, она нужна
для получения параметров, отсылаем их главной странице и закрываем */
document.addEventListener('DOMContentLoaded', function (e) {
    var uriParams = decodeQ(location.search.slice(1));
    if (uriParams.indexOf('oauth_popup=on') > -1) {
        window.opener.postMessage(location.hash.slice(1), location.origin);
        //window.close();
    }
}, false);


// глобальный обработчик кликов
document.body.addEventListener('click', {
        handleEvent: function (e) {
            var target = e.target;
            var id = target.id;

            if (id && clickHandlersRegister[id]) {
                clickHandlersRegister[id].call(window, e);
            } else {
                console.warn('Нет такого обработчика');
            }

        }
    },
    false
);

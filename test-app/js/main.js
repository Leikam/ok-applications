window.console && console.log('init location: ', location);

var DOMAIN = serverConfig.app_domain || 'ok.ru';
var WIDGET_REGISTER = {};

prepareConfig();

OKSDK.init(appConf, init_success, init_failure);

function init_success() {
    window.console && console.info('Initialization success', appConf);
    window.console && console.info('hash', location.hash.split('&'));
    window.console && console.info('query', location.search.split('&'));

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
            var linkSrc = 'http://test.ok.ru' + '' + '/profile/' + data.uid;
            linkToFeed.href = linkSrc;
            linkToFeed.innerHTML = linkSrc;
            linkToFeed.style.display = '';
        } else {
            linkToFeed.style.display = 'none';
        }
    });

    WIDGET_REGISTER.OAuth2Permissions = new OKSDK.Widgets.Builder(
        'OAuth2Permissions',
        {
            redirect_uri: DOMAIN + '/return.html',
            response_type: 'token',
            show_permissions: true
        }
    );

    WIDGET_REGISTER.WidgetGroupAppPermissions = new OKSDK.Widgets.Builder(
        OKSDK.Widgets.builds.askGroupAppPermissions,
        {
            redirect_uri: DOMAIN + '/return.html',
            response_type: 'token'
        }
    );
}
function init_failure() {
    window.console && console.error('Initialization failed', this);
}

function API_callback(method, result, data) {
    errorHandler(method, result, data);
    window.console && console.log("Global API callback.\nMethod[0]: %s,\n result[1]: %o,\n data[2]: %o", method, result, data);
}

function stub_callback(method, result, data) {
    errorHandler(method, result, data);
    window.console && console.log("Stub callback.\nMethod[0]: %s,\n result[1]: %o,\n data[2]: %o", method, result, data);
}

function callRestMethod(method, opts, callback) {
    OKSDK.REST.call(method, (opts || {}), (callback || stub_callback));
    window.console && console.log(method + ' called');
}

var content = document.getElementsByClassName('content')[0],
    targetWindow,
    locationObj = {};

var clickHandlersRegister = {
    testAnyFunc: function (e) {},
    cleanConfig: function(e) {},
    oauthme: function () {
        var query = '';
        query += appConf.widget_server + 'oauth/authorize' +
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
        window.console && console.log(query);
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
    getGroups: function () {
        var inited = false;
        callRestMethod('group.getUserGroupsInfo',
            {fields: '*'},
            function (status, data, error) {
                if (status == 'ok') {
                    //var fragment = document.createDocumentFragment();
                    var result = '';
                    data.userGroups.forEach(function (group) {
                        result +=
                            '<img src="' + group.picAvatar + '"/>' +
                            group.name.bold() + ': ' +
                            '<button class="js-append-groupId" value="' + group.groupId + '">скопировать ID:' + group.groupId + '</button>' +
                            '\n';
                    });
                    content.innerHTML = result;
                } else {
                    return alert(error.error_code + '\t' + error.error_msg + '\n' + error.error_data);
                }

                if (!inited) {
                    content.addEventListener('click', function (e) {
                        var target = e.target;
                        if (target && target.className.match(/\bjs-append-groupId\b/)) {
                            var groupId = target.value;
                            appConf.group_id = groupId;

                            var hash = location.hash;
                            var search = location.search;
                            if (hash.indexOf('group_id=') == -1 || search.indexOf('group_id=') == -1) {
                                search.length > 0
                                    ? location.search += ('&group_id=' + groupId)
                                    : location.hash += ('&group_id=' + groupId);

                            }
                        }
                    });

                    inited = true;
                }
            });
    },
    requestPayment: function (e) {
        var opts = {
            //mob_pay_url: 'paymentnew.ok.ru'
        };
        OKSDK.Payment.show("Banana", "200", "777", opts);
    },
    _post: function (e) {
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
            attachment: attachment,
            return: DOMAIN + '/return.html',
            popup: 'off',
            utext: 'on',
            silent: 'off',
            popupConfig: popupConfig
        };

        OKSDK.Widgets.post(null, params);
    },
    _invite: function () {
        OKSDK.Widgets.invite(null, null);
    },
    _suggest: function () {
        OKSDK.Widgets.suggest(null, null);
    },
    requestPermissions: function () {
        WIDGET_REGISTER.OAuth2Permissions
            .addParams({scope: appConf.oauth.scope})
            .run();
    },
    requestChatPermission: function () {
        //// call by builder example:
        //WIDGET_REGISTER.WidgetGroupAppPermissions
        //    .addParams(
        //        {
        //            groupId: appConf.group_id, // if app is external we need to get groupId first;
        //            scope: appConf.group.scopeMap.GROUP_BOT_API_TOKEN
        //        }
        //        )
        //    .run();

        // if app launches as external,  we need to get and set groupId explicitly;
        OKSDK.Widgets.askGroupAppPermissions('GROUP_BOT_API_TOKEN', DOMAIN + '/return.html', {groupId: appConf.group_id});
    },
    requestPostingPermission: function () {
        WIDGET_REGISTER.WidgetGroupAppPermissions
            .addParams(
                {
                    scope: appConf.group.scopeMap.MESSAGES_FROM_GROUP,
                    popupConfig: {
                        name: "demo_title",
                        width: 600,
                        height: 300,
                        options: 'status=0, menubar=0'
                    }
                }
            )
            .run();
    },
    requestAllGroupPermissions: function () {
        //if (OKSDK.Util.resolveContext().isExternal && !appConf.group_id) {
        //    return alert('Не указан ID группы. Откройте все группы пользователя и выберите нужный ID, кликнув по кнопке');
        //}

        WIDGET_REGISTER.WidgetGroupAppPermissions
            .addParams({
                groupId: appConf.group_id, // if app is external we need to get groupId first;
                scope: appConf.group.scope
            })
            .run();
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

                    content.innerHTML = '';
                    content.appendChild(document.createTextNode(result));
                    content.appendChild(fragment);
                }
            }
        );
    },
    openWindow: function (e) {
        var elem = document.getElementById('openWindowData');
        window.name = 'parent';
        targetWindow = window.open(('./' + elem.value + '.html') || '/');
    }
};

function prepareConfig() {
    var hrefQuery = location.search;
    var confParamName = 'app_conf';
    if (hrefQuery.indexOf(confParamName) > -1) {
        var paramPairs = hrefQuery.slice(1).split('&');
        var paramMap = {};
        for (var i = 0, l = paramPairs.length; i < l; i++) {
            var pair = paramPairs[i];
            var nameValue = pair.split('=');
            paramMap[nameValue[0]] = nameValue[1];
        }
        var configModeValue = paramMap[confParamName];

        switch (configModeValue) {
            case 'dev':
                console.log('Start in dev mode');
                break;
            case 'test':
                console.log('Start in test mode');
                break;
            case 'prod':
                delete appConf.api_server;
                delete appConf.widget_server;
                delete appConf.oauth.layout;
                console.log('Start in prod mode');
                break;
            default:
                console.log('default');
                console.log('Start in default mode');
        }
    }
}

/* Пример обработки авторизации на основной странице */
window.addEventListener('message', function (e) {
    window.console && console.log('-> Message received: ', e.data);
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
        window.close();
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
                window.console && console.warn('Нет такого обработчика');
            }

        }
    },
    false
);

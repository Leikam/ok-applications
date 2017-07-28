var paramsHandlerMap = {
    'pms.app_conf': function (value) {
        switch (value) {
            case 'test':
                window.console && console.log('>> TEST mode <<');
                appConf.widget_server = 'https://test.ok.ru/';
                appConf.api_server = 'https://apitest.ok.ru/';
                break;
            case 'prod':
                window.console && console.log('>> PROD mode <<');
                delete appConf.api_server;
                delete appConf.widget_server;
                delete appConf.oauth.layout;
                break;
            default:
                window.console && console.log('>> default DEV mode <<');
                window.console && console.log('By devmode GROUP_ID settled to ' + appConf.group_id);
        }
    },
    'pms.app_key': function (value) {
        appConf.app_key = value;
    },
    'pms.app_id': function (value) {
        appConf.app_id = value;
    }
};

function prepareConfig() {
    var hrefQuery = location.search;
    var paramPairs = hrefQuery.slice(1).split('&');
    var parsedUrlParamsMap = {
        'pms.app_conf': true
    };

    for (var i = 0, l = paramPairs.length; i < l; i++) {
        var pair = paramPairs[i];
        var nameValue = pair.split('=');
        parsedUrlParamsMap[nameValue[0]] = nameValue[1];
    }

    for (var k in paramsHandlerMap) {
        var handler = paramsHandlerMap[k];
        var paramValue = parsedUrlParamsMap[k];
        if (paramValue) {
            handler(paramValue)
        }

    }
}
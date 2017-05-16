// test | dev envinronment switch
var TEST_ENV =
    false
    //true
;

var IP = '192.168.0.105'; // your external app address
var serverConfig = {
    appName: 'api-test-app',
    domain: IP + ':8089',
    widget_server: TEST_ENV
        ? 'https://connect.ok.ru/'
        : ('http://'+ IP +':8088/'),
    api_server: TEST_ENV
        ? 'http://apitest.ok.ru'
        : 'http://sdevr65.mail.msk:8090/'
};

var appConf = {
    /** application id */
    app_id: TEST_ENV
        ? "1250486784"
        : "806400",
    /** application public key */
    app_key: TEST_ENV
        ? "CBALOJILEBABABABA"
        : "CBAPENABABABABABA",
    group: {
        scope: [
                'MESSAGES_FROM_GROUP',
                'GROUP_BOT_API_TOKEN'
            ].join(';'),
        scopeMap: {
            MESSAGES_FROM_GROUP: 'MESSAGES_FROM_GROUP',
            GROUP_BOT_API_TOKEN: 'GROUP_BOT_API_TOKEN'
        }
    },
    /** application permissions
     * @see https://apiok.ru/ext/oauth/permissions
     * */
    oauth: {
        scope: [
            'VALUABLE_ACCESS',
            'PUBLISH_NOTE',
            'PUBLISH_TO_STREAM',
            'GROUP_CONTENT',
            'PERSONAL_CONTENT',
            //'APP_INVITE',
            //'GET_EMAIL',
            'PHOTO_CONTENT',
            'SETTINGS',
            'LIKE'
        ].join(';'),
        layout: "w"
    },
    widget_server: serverConfig.widget_server,
    api_server: serverConfig.api_server
};



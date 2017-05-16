var appConf = {
    app_id: serverConfig.app.app_id,
    app_key: serverConfig.app.app_key,
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
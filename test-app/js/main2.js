var domReady = function (callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};


domReady(function () {

    window.addEventListener('message', function (e) {
        console.log('got message', e,  e.data);
    });


    var config = {
        //app_id: 1253167616,
        app_id: appConf.app_id,
        //app_key: 'CBADNCLLEBABABABA'
        app_key: appConf.app_key
    };

    window.OKSDK.init(config,
        function () {
            alert('success');
            window.API_callback = function (method, result, data) {
                'use strict';

                document.getElementById('requestPostingPermission_shortcut').addEventListener('click', function () {
                    console.log('clicked');
                    window.OKSDK.Widgets.askGroupAppPermissions('MESSAGES_FROM_GROUP');
                })

            };
            window.OKSDK.Widgets.askGroupAppPermissions('MESSAGES_FROM_GROUP');
        },
        function (error) {
            alert(error);
        });
});
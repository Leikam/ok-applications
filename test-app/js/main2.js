var domReady = function (callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function () {
    var config = {
        app_id: 1253167616,
        app_key: 'CBADNCLLEBABABABA'
    };

    window.OKSDK.init(config,
        function () {
            alert('success');
            window.API_callback = function (method, result, data) {
            };
            window.OKSDK.Widgets.askGroupAppPermissions('MESSAGES_FROM_GROUP');
        },
        function (error) {
            alert(error);
        });
});
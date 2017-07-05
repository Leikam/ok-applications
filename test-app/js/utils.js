function errorHandler(method, result, data) {
    if (result == null) {
        console.log('Ошибка.', method);
        console.log("Ошибка. \nКод: %s, \nсообщение: %s", data.error_code, (data.error_msg || data.error_message))
    }
}

function getUrlParam(param) {
    window.location.hash
        .slice(1)
        .split('&')
        .forEach(function (item) { var data = item.split('='); locationObj[data[0]] = data[1] });

    if (param) {
        return locationObj[param];
    }

    return locationObj;
}

function decodeQ(query) {
    return decodeURIComponent(query).split('&');
}

function getCurrentUserData(callback) {

    OKSDK.REST.call("users.getCurrentUser",
        {},
        function (code, data, error) {
            if (code != 'error' && data) {
                callback(data)
            } else {
                console.error('FAILED: users.getCurrentUser')
                callback(null)
            }
        }
    );
}

function toggleBlock(e) {
    var target = e.target;
    var element = document.getElementById(target.getAttribute('data-toggle-forId'));
    element.classList.contains('hidden')
        ? element.classList.remove('hidden')
        : element.classList.add('hidden');
}
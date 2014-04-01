/* Main APP JS file */

var app = {
		
    device: null,
    initialize: function (message, title) {

        var ierr = ErrorStorage.hasError(message);


        if (navigator.notification) {
            if (ierr == 0) {
                ErrorStorage.addError(message);
                navigator.notification.alert(message, alertDismissed(message), title, 'OK');
            }
        }
        else {

            if (ierr == 0) {
                ErrorStorage.addError(message);
                alert(title ? (title + ": " + message) : message);
                ErrorStorage.removeError(message);
            }
        }
    }
}
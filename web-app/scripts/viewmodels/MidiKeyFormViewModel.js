define([
    'knockout'
], function (ko) {
    'use strict';
    return function (socket) {

        this.newKeyName = ko.observable("")

        this.setupKey = function () {
            var newKeyName = this.newKeyName()
            if (newKeyName != "") { // todo Prevent duplicates
                socket.emit('setupKey', newKeyName)
                // todo: loading state...
            }
            this.newKeyName(""); // Clear the text box
        }

        this.removeAllKeys = function () {
            if (confirm('Remove all midi keys?') && confirm('Remove all midi keys?????')) {
                socket.emit('removeAllKeys')
            }
        }

    };
})

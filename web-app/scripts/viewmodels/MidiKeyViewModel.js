define([
    'underscore',
    'knockout'
], function (_, ko) {
    'use strict';
    return function (socket, key) {
        this.name = key.name
        this._id = key._id

        this.remove = function () {
            socket.emit('removeKey', key._id)
        }
    };
})

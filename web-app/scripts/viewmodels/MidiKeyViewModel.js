define([
    'underscore',
    'jquery',
    'knockout'
], function (_, $, ko) {
    'use strict';
    return function (socket, key) {
        this.name = key.name
        this._id = key._id
        this.identifier = key.identifier
        this.active = ko.observable(false)

        this.toggleActive = function (key, event) {
            var $currentTarget = $(event.currentTarget)
            $currentTarget.siblings('.active').removeClass('active')
            $currentTarget.addClass('active')
        }

        this.remove = function () {
            socket.emit('removeKey', key._id)
        }
    };
})

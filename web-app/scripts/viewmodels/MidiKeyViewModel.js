define([
    'underscore',
    'knockout'
], function (_, ko) {
    'use strict';
    return function (socket, key) {
        this.name = ko.observable(key.name)

        this.remove = function () {
        }
    };
})

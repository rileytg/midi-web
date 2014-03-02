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

        var persistedObservable = function (value, viewModel, attributeName) {
            var observable = ko.observable(value)

            observable.subscribe(function(newValue) {
                socket.emit('keyUpdated', {
                    id: viewModel._id,
                    attribute: attributeName,
                    newValue: newValue
                })
            })
            return observable
        }
        this.color = persistedObservable(key.color, this, 'color')

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

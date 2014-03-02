define([
    'jquery',
    'underscore',
    'socketio',
    'knockout'
], function ($, _, io, ko) {
    'use strict';

// todo: old util might still need, move to helper soon at least for logging
//    var commas = function (data, optionalModifier) {
//        var modifier = optionalModifier || 0
//        return  (data[0] + modifier) +
//                ',' + (data[1] + modifier) +
//                ',' + (data[2] + modifier)
//    }

    var socket = io.connect('http://0.0.0.0:8081')

    var MidiKeyListModel = function () {
        var model = this
        model.newKeyName = ko.observable("");
        model.allKeys = ko.observableArray([]); // Initial items starts empty


        this.getKeys = function () {
            socket.emit('getKeys', {})
            socket.on('keys', function (keys) {
                model.allKeys.removeAll()
                _(keys).each(function (key) {
                    model.allKeys.push(key)
                })
            })
        }

        this.getKeys()

        this.setupKey = function () {
            var newKeyName = this.newKeyName()
            if (newKeyName != "") { // todo Prevent duplicates
                socket.emit('setupKey', newKeyName)
                // todo: loading state...
            }
            this.newKeyName(""); // Clear the text box
        }

        socket.on('keyAdded', function (key) {
            model.allKeys.push(key)
        })
    };

    ko.applyBindings(new MidiKeyListModel());

    socket.on('messagesToUser', function (data) {
        $('h1').text(data)
    })

    return {
        start: function (socket) {

        }
    }

});

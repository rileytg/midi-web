define([
    'jquery',
    'underscore',
    'socketio',
], function ($, _, io) {
    'use strict';

// todo: old util might still need, move to helper soon at least for logging
//    var commas = function (data, optionalModifier) {
//        var modifier = optionalModifier || 0
//        return  (data[0] + modifier) +
//                ',' + (data[1] + modifier) +
//                ',' + (data[2] + modifier)
//    }


    // Here's my data model
    var ViewModel = function (first, last) {
        this.firstName = ko.observable(first);
        this.lastName = ko.observable(last);

        this.fullName = ko.computed(function () {
            // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
            return this.firstName() + " " + this.lastName();
        }, this);
    };

    ko.applyBindings(new ViewModel("Planet", "Earth")); // This makes Knockout get to work


    var socket = io.connect()

    function addKey() {
        var keyName = $('#js-key-name').val()
        socket.emit('keyName', keyName)
    }

//    $('#js-bind-key').bind('click', addKey)
    $('#js-bind-key-form').bind('submit', addKey)
    socket.emit('getKeys', {})

    socket.on('messagesToUser', function (data) {
        $('h1').text(data)
    })

    socket.on('keys', function (keys) {
        if (window.console) {
            console.log('25:> ', keys)
        }

    })

    return {
        start: function (socket) {
            console.log(socket);
        }
    }

});

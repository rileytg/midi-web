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


    var BetterListModel = function () {
        this.itemToAdd = ko.observable("");
        this.allItems = ko.observableArray(["Fries", "Eggs Benedict", "Ham", "Cheese"]); // Initial items
        this.selectedItems = ko.observableArray(["Ham"]);                                // Initial selection

        this.addItem = function () {
            if ((this.itemToAdd() != "") && (this.allItems.indexOf(this.itemToAdd()) < 0)) // Prevent blanks and duplicates
                this.allItems.push(this.itemToAdd());
            this.itemToAdd(""); // Clear the text box
        };

        this.removeSelected = function () {
            this.allItems.removeAll(this.selectedItems());
            this.selectedItems([]); // Clear selection
        };

        this.sortItems = function () {
            this.allItems.sort();
        };
    };

    ko.applyBindings(new BetterListModel());

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

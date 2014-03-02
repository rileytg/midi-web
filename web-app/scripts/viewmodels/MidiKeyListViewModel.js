define([
    'underscore',
    'knockout',
    'jquery',
    'MidiKeyViewModel'
], function (_, ko, $, MidiKeyViewModel) {
    'use strict';
    return function (socket) {
        var MidiKeyListViewModel = this

        MidiKeyListViewModel.allKeys = ko.observableArray([]) // Initial items starts empty

        this.getKeys = function () {
            socket.emit('getKeys', {})
        }
        socket.on('keys', function (keys) {
            MidiKeyListViewModel.allKeys.removeAll()
            _(keys).each(function (key) {
                MidiKeyListViewModel.allKeys.push(new MidiKeyViewModel(socket, key))
            })
        })

        socket.on('keyPressed', function (id) {
            var key = _(MidiKeyListViewModel.allKeys()).where({_id: id})[0]
            $('body').css('background-color', key.color())
        })


        this.getKeys()

        socket.on('keyAdded', function (key) {
            MidiKeyListViewModel.allKeys.splice(0, 0, new MidiKeyViewModel(socket, key))
        })
        socket.on('keyRemoved', function (id) {
            MidiKeyListViewModel.allKeys.remove(
                _(MidiKeyListViewModel.allKeys()).where({_id: id})[0]
            );
        })

    };
})

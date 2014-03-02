define([
    'underscore',
    'knockout',
    'jquery',
    'bouncie',
    'MidiKeyViewModel'
], function (_, ko, $, bouncie, MidiKeyViewModel) {
    'use strict';
    return function (socket) {
        var MidiKeyListViewModel = this

        var b = bouncie("#f0f")

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
            $('body').css('background-color', b.color())
            b.color(key.color())
            b.bounce()
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

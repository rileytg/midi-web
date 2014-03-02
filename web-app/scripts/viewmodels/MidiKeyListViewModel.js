define([
    'underscore',
    'knockout',
    'MidiKeyViewModel'
], function (_, ko, MidiKeyViewModel) {
    'use strict';
    return function (socket) {
        var MidiKeyListViewModel = this

        MidiKeyListViewModel.newKeyName = ko.observable("")
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
            MidiKeyListViewModel.allKeys.push(new MidiKeyViewModel(socket, key))
        })
        socket.on('keyRemoved', function (id) {
            MidiKeyListViewModel.allKeys.remove(
                _(MidiKeyListViewModel.allKeys()).where({_id: id})[0]
            );
        })

        this.removeAllKeys = function () {
            if (confirm('Remove all midi keys?') && confirm('Remove all midi keys?????')) {
                socket.emit('removeAllKeys')
            }
        }

    };
})

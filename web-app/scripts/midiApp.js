define([
    'jquery',
    'underscore',
    'socketio',
    'knockout',
    'MidiKeyListViewModel',
    'MidiKeyFormViewModel'
], function ($, _, io, ko, MidiKeyListViewModel, MidiKeyFormViewModel) {
    'use strict';

    return {
        start: function (socket) {
            var MidiAppViewModel = function () {
                var model = this

                model.flashMessage = ko.observable("Loading...")
                model.midiKeyList = ko.observable(new MidiKeyListViewModel(socket))
                model.midiKeyForm = ko.observable(new MidiKeyFormViewModel(socket))

                socket.on('messagesToUser', function (data) {
                    model.flashMessage(data)
                })


            }

            ko.applyBindings(new MidiAppViewModel())

        }
    }

});

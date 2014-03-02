define([
    'jquery',
    'underscore',
    'socketio',
    'knockout',
    'MidiKeyListViewModel'
], function ($, _, io, ko, MidiKeyListViewModel) {
    'use strict';

    var socket = io.connect('http://0.0.0.0:8081')



    var MidiAppViewModel = function () {
        var model = this

        model.flashMessage = ko.observable("Loading...")
        model.midiKeyList = ko.observable(new MidiKeyListViewModel(socket))


        socket.on('messagesToUser', function (data) {
            model.flashMessage(data)
        })


    }

    ko.applyBindings(new MidiAppViewModel())


    return {
        start: function (socket) {

        }
    }

});

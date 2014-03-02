// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        'socketio': {
            exports: 'io'
        },
        'underscore': {
            exports: '_'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery.min',
        underscore: '../bower_components/underscore/underscore',
        knockout: '../bower_components/knockout/build/output/knockout-latest',
        socketio: '//0.0.0.0:8081/socket.io/socket.io',
        midiApp: 'midiApp',
        MidiKeyListViewModel: 'viewmodels/MidiKeyListViewModel',
        MidiKeyViewModel: 'viewmodels/MidiKeyViewModel'
    }
});


define([
    'jquery',
    'midiApp'
], function ($, midiApp) {

    $(document).ready(function () {
        var socket = io.connect('http://0.0.0.0:8081')
        midiApp.start(socket)
    })

});

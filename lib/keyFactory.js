var midi = require('midi')
        , util = require('util')
        , mongoose = require('mongoose')

var Schema = mongoose.Schema

var midiInputSchema = new Schema({
    name: String,
    identifier: [Number],
    value: Number
})
var MidiInput = mongoose.model('MidiInput', midiInputSchema);

var _createInput = function () {
    var input = new midi.input()

    // Count the available input ports.
    input.getPortCount()


    return input
}

module.exports = function (userStream) {

    var input = _createInput()
    userStream("Loaded MIDI controller: " + input.getPortName(0))

    // Open the first available input port.
    input.openPort(0);

    // Sysex, timing, and active sensing messages are ignored
    // by default. To enable these message types, pass false for
    // the appropriate type in the function below.
    // Order: (Sysex, Timing, Active Sensing)
    input.ignoreTypes(false, false, false);

    return {
        addKey: function (name) {
            userStream("Press a key")
            input.once('message', function (deltaTime, message) {
                new MidiInput({
                    name: name,
                    identifier: message.slice(0, 1),
                    value: message[3]
                })
                userStream('m:' + message + ' d:' + deltaTime);
                userStream('Now give it a name')
            });
        }
    };
}

var midi = require('midi')
        , util = require('util')
        , mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/midi-web-development');


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

module.exports = function (userFlash) {

    var input = _createInput()
    userFlash("Loaded MIDI controller: " + input.getPortName(0))

    // Open the first available input port.
    input.openPort(0);

    // Sysex, timing, and active sensing messages are ignored
    // by default. To enable these message types, pass false for
    // the appropriate type in the function below.
    // Order: (Sysex, Timing, Active Sensing)
    input.ignoreTypes(false, false, false);

    return {
        setupKey: function (name, callback) {
            userFlash("Press a key")
            input.once('message', function (deltaTime, message) {
                var midiInput = new MidiInput({
                    name: name,
                    identifier: message.slice(0, 2),
                    value: message[2]
                })
                midiInput.save(function (err, input) {
                    if (err) {
                        console.log(err)
                        userFlash('Error saving' + util.inspect(err) + util.inspect(midiInput))
                    }
                    callback(midiInput)
                })
            });
        },
        keys: function (callback) {
            MidiInput.find(function (err, midiInputs) {
                callback(midiInputs)
            })
        },
        removeAllKeys: function (callback) {
            MidiInput.remove().exec()
            this.keys(callback)
        },
        removeKey: function (id, callback) {
            MidiInput.remove({_id: id}, function (err) {
                if (err)
                    console.log(err)
                callback()
            })
        }
    };
}

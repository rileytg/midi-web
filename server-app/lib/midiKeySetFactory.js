var midi = require('midi')
        , util = require('util')
        , mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/midi-web-development');


var Schema = mongoose.Schema

var midiInputSchema = new Schema({
    name: String,
    identifier: String,
    value: Number,
    color: String
})
var MidiInput = mongoose.model('MidiInput', midiInputSchema);

var _createInput = function () {
    var input = new midi.input()

    // Count the available input ports.
    input.getPortCount()


    return input
}

module.exports = function (userFlash, socket) {

    var input = _createInput()
    userFlash("Loaded MIDI controller: " + input.getPortName(0))

    // Open the first available input port.
    input.openPort(0);

    // Sysex, timing, and active sensing messages are ignored
    // by default. To enable these message types, pass false for
    // the appropriate type in the function below.
    // Order: (Sysex, Timing, Active Sensing)
    input.ignoreTypes(false, false, false);

    input.on('message', function (deltaTime, message) {
        console.log("@@@@@@@ ", message)
//        console.log(identifier)
        var identifier = message.slice(0, 2).toString()
        console.log("45:> " , identifier);
        MidiInput.find({identifier: identifier}, function (err, items) {
            if (err) {
                console.log(err)
            }
            if (items && items[0]) {
                socket.emit('keyPressed', items[0]._id)
            }
        })
    })

    return {
        setupKey: function (name, callback) {
            userFlash("Press a key")
            input.once('message', function (deltaTime, message) {
                console.log("!!!!!!!!!! ", message)
                var midiInput = new MidiInput({
                    name: name,
                    identifier: message.slice(0, 2).toString(),
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
        },
        updateKey: function (unitOfWork, callback) {
            var attributeUpdate = {}
            var attributeToUpdate = unitOfWork.attribute
            attributeUpdate[attributeToUpdate] = unitOfWork.newValue

            MidiInput.update({_id: unitOfWork.id}, attributeUpdate, function (err, numberAffected) {
                if (err || numberAffected < 1)
                    console.log(err)

                callback()
            })
        }
    };
}

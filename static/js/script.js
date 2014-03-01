/* Author: YOUR NAME HERE
 */

$(document).ready(function () {

    var commas = function (data, optionalModifier) {
        var modifier = optionalModifier || 0
        return  (data[0] + modifier)
                + ',' + (data[1] + modifier)
                + ',' + (data[2] + modifier)
    }

    var socket = io.connect();

    $('#js-bind-key').bind('click', function () {
        var keyName = $('#js-key-name').val()
        socket.emit('keyName', keyName);
        socket.emit('getKeys', {});
    });

    socket.on('messagesToUser', function (data) {
        $('h1').text(data);
    });

    socket.on('keys', function (keys) {
        if(window.console) console.log("25:> " , keys);
        for(var key in keys) {
            var keyInLi = $('li').text(key)
            $('ul').append(keyInLi);

        }
    });
});

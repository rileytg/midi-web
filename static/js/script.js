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
    });

    socket.on('messagesToUser', function (data) {
//        var formatedData = commas(data, 70)
        $('h1').text(data);
//        $('body').css({
//            'background-color': 'rgb(' + formatedData + ')'
//        })
    });
});

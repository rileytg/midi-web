//setup Dependencies
var connect = require('connect')
        , express = require('express')
        , io = require('socket.io')
        , midiKeySetFactory = require('./lib/midiKeySetFactory')
        , port = (process.env.PORT || 8081);

//Setup Express
var server = express.createServer();
server.configure(function () {
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function (err, req, res, next) {
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: {
            title: '404 - Not Found', description: '', author: '', analyticssiteid: 'XXXXXXX'
        }, status: 404 });
    } else {
        res.render('500.jade', { locals: {
            title: 'The Server Encountered an Error', description: '', author: '', analyticssiteid: 'XXXXXXX', error: err
        }, status: 500 });
    }
});
server.listen(port);

//Setup Socket.IO
io = io.listen(server);
io.sockets.on('connection', function (socket) {

    var messageToUser = function (message) {
        socket.emit('messagesToUser', message)
    }
    var midiKeySet = midiKeySetFactory(messageToUser, socket)

    console.log('Client Connected');
//    io.broadcast.emit('bingo', {});
//    io.emit('bingo', {});


    socket.on('setupKey', function (keyName) {
        console.log('received: ', keyName)
        midiKeySet.setupKey(keyName, function (key) {
            messageToUser('Saved ' +  key.name + ' as ' + key.identifier + ' successfully.')
            socket.emit('keyAdded', key)
        })
    });

    socket.on('getKeys', function () {
        midiKeySet.keys(function (keys) {
            socket.emit('keys', keys);
        })
    });

    socket.on('removeAllKeys', function () {
        midiKeySet.removeAllKeys(function (keys) {
            socket.emit('keys', keys);
        })
    });
    socket.on('removeKey', function (id) {
        midiKeySet.removeKey(id, function () {
            socket.emit('keyRemoved', id);
        })
    });

    socket.on('keyUpdated', function (unitOfWork) {
        console.log(unitOfWork)
        midiKeySet.updateKey(unitOfWork, function () {
            socket.emit('keyUpdated');
        })
    });

    socket.on('disconnect', function () {
        console.log('Client Disconnected.');
    });
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function (req, res) {
    res.render('index.jade', {
        locals: {
            title: 'Your Page Title', description: 'Your Page Description', author: 'Your Name', analyticssiteid: 'XXXXXXX'
        }
    });
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function (req, res) {
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function (req, res) {
    throw new NotFound;
});

function NotFound(msg) {
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port);

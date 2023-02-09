// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html


var blobs = [];

function Blob(id, x, y, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
}

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 240);

function heartbeat() {
    io.sockets.emit('heartbeat', blobs);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
    'connection',
    // We are given a websocket object in our function
    function(socket) {
        console.log('We have a new client: ' + socket.id);

        socket.on('start', function(data) {
            console.log(socket.id + ' ' + data.x + ' ' + data.y + ' ' + data.r);
            var blob = new Blob(socket.id, data.x, data.y, data.r);
            blobs.push(blob);


        });

        socket.on('update', function(data) {
            //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
            var blobi = new Blob(0, 0, 0);
            for (var i = 0; i < blobs.length; i++) {
                if (socket.id == blobs[i].id) {
                    blobi = blobs[i];
                    blobi.x = data.x;
                    blobi.y = data.y;
                    blobi.r = data.r;
                }
            }
            // blob.x = data.x;
            // blob.y = data.y;
            // blob.r = data.r;
        });

        socket.on('disconnect', function() {
            console.log('Client has disconnected');
        });
    }
);
// io.sockets.on('connection',
//     // We are given a websocket object in our function
//     function (socket) {
//
//         console.log("We have a new client: " + socket.id);
//
//         // When this user emits, client side: socket.emit('otherevent',some data);
//         socket.on('start',
//             function(data) {
//                 console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
//                 var blob = new Blob(socket.id, data.x, data.y, data.r);
//                 blobs.push(blob);
//             }
//         );
//
//
//         socket.on('update',
//             function(data) {
//                 // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
//                 // var blob = new Blob(socket.id, data.x, data.y, data.r);
//                 // blobs.push(blob);
//                 var blob;
//                 for(var i=0; i<blobs.length; i++) {
//                     if(socket.id == blobs[i].id) {
//                         blob = blobs[i];
//                     }
//                 }
//                 blob.x = data.x;
//                 blob.y = data.y;
//                 blob.r = data.r;
//             }
//         );
//
//         socket.on('disconnect', function() {
//             console.log("Client has disconnected");
//         });
//     }
// );

// var express = require('express');
// var app = express();
// var server = app.listen(3000);
// app.use(express.static('public'));
// console.log("My socket server is running");
// var socket = require('socket.io');
// var io = socket(server);
// io.sockets.on('connection', newConnection);
//
// function newConnection(socket) {
//     console.log('new connection: ' + socket.id);
//     socket.on('mouse', mouseMsg);
//     function mouseMsg(data) {
//         socket.broadcast.emit('mouse', data);
//         console.log(data)
//     }
// }

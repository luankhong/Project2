var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});
var message;

console.log('websockets server started');

ws.on('connection', function(socket) {
    console.log('client connection established');

    socket.on('message', function(data) {
        message = data;

        let parseMessage = JSON.parse(message);

        if (parseMessage.header === 'poll') {
            broadcast();
        } else if (parseMessage.header === 'answer') {
            sendToHost();
        }
    });
});

//Host is the first one to connect. Need to change it to professor's socket somehow.
function sendToHost() {
    console.log('message sent to host' + message);
    let first = true;
    ws.clients.forEach(function(clientSocket) {
        if (first) {
            clientSocket.send(message);
            first = false;
        }
    });
}

function broadcast() {
    console.log('message broadcast: ' + message);
    ws.clients.forEach(function(clientSocket) {
        clientSocket.send(message);
    });
}

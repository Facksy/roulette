const fs = require('fs');
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer((req, res) => {
    fs.readFile('./index.html', 'utf8' , (err, data) => {
        if (!err)
            res.end(data);
    })
});
server.listen(process.env.PORT);

lstWS = [];
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        console.log('Received Message:', message.utf8Data);
        connection.sendUTF('Hi this is WebSocket server!');
    });
    connection.on('close', function(reasonCode, description) {
        const index = lstWS.indexOf(connection);
        if(index > -1)
            array.splice(index, 1);
    });
    lstWS.push(connection);
});

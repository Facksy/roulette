const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer((req, res) => {
    res.end(`<!DOCTYPE html>
        <html>
        <head>
          <title>WebSocket Playground</title>
        </head>
        <body>
        </body>
        <script>
        const ws = new WebSocket('wss://groulette.herokuapp.com/');
        ws.onopen = function() {
            console.log('WebSocket Client Connected');
            ws.send('Hi this is web client.');
        };
        ws.onmessage = function(e) {
          console.log("Received: '" + e.data + "'");
        };
        </script>
        </html>`);
});
server.listen(process.env.PORT);
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
        console.log('Client has disconnected.');
    });
});

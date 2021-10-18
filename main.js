const fs = require('fs');
const http = require('http');
const WebSocketServer = require('websocket').server;

function getRdmInt(param1, param2){
    return param2 ? (param1 > param2 ? (param2) : (Math.floor(Math.random()*param2) + param1)) : (Math.floor(Math.random()*param1));
}

function getRdmList(lst){
    return lst[getRdmInt(lst.length)];
}

let lstWS = [];
let lstNbr = [];

const server = http.createServer((req, res) => {
    fs.readFile('C:\\Users\\kingl\\Desktop\\roulette/index.html', 'utf8' , (err, data) => {
        if (!err){
            let newdata ='';
            for(let nbr of lstNbr){
                newdata += `<div class='topdiv' id='${nbr}'>
                                ${nbr}<button class='btn close' onclick=\"deleteEle('${nbr}')\">
                                <i class='fas fa-times'></i>
                            </button>
                        </div>`
            }
            data = data.replace('$$divland', newdata);
            res.end(data);
        }
        else {
            console.log(err);
        }
    })
});
//server.listen(5545);
server.listen(process.env.PORT);

const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        let msg = message.utf8Data;
        console.log('Received Message:', msg);
        let params = msg.split(':');
        switch(params[0]){
            case 'add':
                if(lstNbr.indexOf(params[1]) == -1)
                    lstNbr.push(params[1]);
                else
                    msg = null;
                break;
            case 'delete':
                const index = lstNbr.indexOf(params[1]);
                if(index > -1)
                    lstNbr.splice(index, 1);
                break;
            case 'roll':
                let chosed = getRdmList(lstNbr);
                msg = 'print:'+chosed;
                break;
            case 'raz':
                lstNbr = [];
        }
        if(msg){
            lstWS.forEach(item => {
                item.sendUTF(msg);
            });
        }
    });
    connection.on('close', function(reasonCode, description) {
        const index = lstWS.indexOf(connection);
        if(index > -1)
            lstWS.splice(index, 1);
    });
    lstWS.push(connection);
    console.log(lstWS.length);
});

/*<div class='topdiv' id='$mot'>
         $mot<button class='btn close' onclick=\"deleteEle('$mot')\">
            <i class='fas fa-times'></i>
        </button>
</div>*/

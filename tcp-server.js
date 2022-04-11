// Include Nodejs' net module.
const Net = require('net');
const fs = require('fs');
const { execFile } = require('child_process');
const process = require('process');

// The port on which the server is listening.
const port = 8484; 
const host = '192.168.178.49'; 

// Create a new TCP server.
const server = Net.createServer(function(socket) {
    socket.write('Echo server created\r\n');
    socket.pipe(socket);
}); 

// The server listens to a socket for a client to make a connection request.
server.listen(port, host, function() { 
    console.log(`Server listening for connection requests on socket ${host}:${port}`+'\n'); 
}); 

let sockets = []; 
// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) { 
    var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`; 
    console.log(`A new connection has been established. Client on ${clientAddress}`+'\n');
    sockets.push(socket);

    var clientName = 'Client' + sockets.length;

    socket.on('data', function(message) {  

        const file = './file';

        if (message.includes('/file')) {

            switch(message.toString().split(" ")[1]){
                case "write":
                    var messageToWrite = "";

                    for(let i = 0; i < message.toString().split(" ").length; i++){
                        if(i > 1){
                            messageToWrite = messageToWrite + message.toString().split(" ")[i] + " ";
                         }
                    }
                    
                    if (checkPermission(clientName, "write") == true) {
                        console.log('---- Writing ----');

                        fs.writeFile(file, messageToWrite, { flag: 'a+'}, error => {
                            if(error){
                                console.error(error);
                                return;
                            }
                            console.log('---- Message has been written! ----');
                        })
                    }
                    break;

                case "execute":

                    if (checkPermission(clientName, "execute") == true) {
                        console.log("inside execute permissions");
                        execFile(
                            'cmd', [ '/c', 'start', '""', 'file.txt' ], { cwd: process.cwd() },
                            (error, stdout, stderr) => {
                              if (error) {
                                console.log(`error: ${error}`);
                                return;
                              }
                              if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                              }
                            }
                        );
                
                    }
                    break;
                                    
                case "read":
                    var content = "";
                    if (checkPermission(clientName, "read") == true) {
                        console.log('---- Reading ----');
                        content = fs.readFileSync(file, 'utf8', { flag: 'r'}, (err, data) => {
                            debugger;
                            if(err){
                                console.error(err); 
                                return;
                            }
                        })
                    }
                    socket.write(content.toString());
                    break;

                default:
                    return "Error with file permissions";
            }
        } else {
            //broadcast(socket.remotePort, message, socket.nickname);
        }
    }); 

    // Add a 'close' event handler to this instance of socket 
    socket.on('close', function(data) { 
        let index = sockets.findIndex(function(o) { 
            return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort; 
        }) 

        if (index !== -1) sockets.splice(index, 1); 
        sockets.forEach((sock) => { 
            sock.write(`${clientAddress} disconnected\n`);
        }); 
        console.log(`connection closed: ${clientAddress}`+'\n');
    }); 
    
    // In case errors happen
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

function checkPermission(user, action) {
    var value;
    switch(user) {
        case "Client1":  value = ['read', 'write', 'execute'].includes(action);break;
        case "Client2":  
        case "Client3":  value = ['read'].includes(action);break;
    }
    if (value == false) {
        console.log("Permission denied");
    } 
    return value;
}


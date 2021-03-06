// Include Nodejs' net module.
const Net = require('net');
const fs = require('fs'); 

// The port on which the server is listening.
const port = 8484; 
//192.168.43.116 - IDEJA
//192.168.43.162 - JETA L
//192.168.43.10 - JETA K
const host = '192.168.43.162'; 

// Create a new TCP server.
const server = Net.createServer(function(socket) {
    socket.write('Echo server created\r\n');
    socket.pipe(socket);
}); 

// The server listens to a socket for a client to make a connection request.
server.listen(port, host, function() { 
    console.log(`Server listening for connection requests on socket ${host}:${port}`+'\n'); 
}); 

const testFolder = './allfiles/';
let sockets = []; 
// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) { 
    var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`; 
    console.log(`A new connection has been established. Client on ${clientAddress}`+'\n');
    sockets.push(socket);

    var clientName = 'Client' + sockets.length;
    socket.nickname = clientName;

    socket.on('data', function(message) {  

        const file = `./allfiles/${message.toString().split(" ")[2]}`;

        if (message.includes('/file')) {

            switch(message.toString().split(" ")[1]){
                case "write":
                    var messageToWrite = "";
                    //get message from cmd command (example: get HELLO WOLRD from command /file write HELLO WORLD)
                    for(let i = 0; i < message.toString().split(" ").length; i++){
                        if(i > 2){
                            messageToWrite = messageToWrite + message.toString().split(" ")[i] + " ";
                         }
                    }
                    
                    if (checkPermission(clientName, "write") == true) {
                        console.log(socket.nickname + '--- has written a message in the file');

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
                        console.log(socket.nickname + "--- has executed the file"); 
                        socket.write("... You are allowed to execute file---"+file.toString());                  
                    }
                    break;
                                    
                case "read":
                    var content = "";
                    if (checkPermission(clientName, "read") == true) {
                        console.log(socket.nickname + '--- has read the contents of file');
                        content = fs.readFileSync(file, 'utf8', { flag: 'r'}, (err, data) => {
                            if(err){
                                console.error(err); 
                                return;
                            }
                        })
                    }
                    socket.write(content.toString());
                    break;
                case "list":
                        let vargu = [];
    
                         fs.readdir(testFolder, (err, files) => {
    
                        for(let i = 0; i<files.length; i++){
                            vargu[i] = files[i];
                        }
    
                        let stringu = vargu.toString();
                        socket.write(stringu);
                    });
                    break;
                default:
                    return "Error with file permissions";
            }
        } else {
            console.log(socket.nickname + ": " + message);
        }
    }); 

    // Add a 'close' event handler to this instance of socket 
    socket.on('close', function(data) { 
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
        case "Client3":  
        case "Client4":  value = ['read'].includes(action);break;
        default: value = false;
    }
    if (value == false) {
        console.log("Permission denied");
    } 
    return value;
}

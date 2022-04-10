// Include Nodejs' net module.
const Net = require('net');
const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });
// The port on which the server is listening.
const port = 8080; 
const host = prompt("Please write the IP address: ");

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
    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    socket.write(`Hello, client ${clientAddress}`);

    socket.on('data', function(data) {  
        // Write the data back to all the connected, the client will receive it as data from the server 
        sockets.forEach(function(sock) { 
            sock.write(socket.remoteAddress + ':' + socket.remotePort + " said " + data + '\n'); 
        }); 
        console.log(data.toString().slice(''));
        let message = data.toString().trim();

        switch(message){
            case "ideja 012345":
                                console.log("\n ----------------------------------------- ");
                                console.log("\n Allowed to read, write, and execute files! ");
                                console.log("\n ----------------------------------------- ");
                                fs.chmod("file.txt", 0o600, () => {
                                    console.log("\n Reading the file contents before changes/writes: ");
                                    console.log(fs.readFileSync('file.txt', 'utf-8'));
                                    console.log("\n ----------------------------------------- ");
                                    console.log(" \nTrying to write to file");
                                    fs.writeFileSync('file.txt', "\n~~~~This is the new written file!~~~~");
                                    console.log("\nThe file after the changes function!");
                                    console.log(fs.readFileSync('file.txt', 'utf-8'));
                                    console.log("\n ----------------------------------------- ");
                                }); 
                                break;
                                
                case "jetak 678910":
                                console.log("\n ----------------------------------------- ");
                                console.log("\n Allowed only to read! ");
                                console.log("\n ----------------------------------------- ");
                                fs.chmod("file.txt", 0o600, () => {
                                    console.log("\n The content of the file you are reading!\n");
                                    console.log(fs.readFileSync('file.txt', 'utf-8'));
                                }); 
                                break;
                case "jetal 111213":
                                console.log("\n ----------------------------------------- ");
                                console.log("\n Allowed only to read! ");
                                console.log("\n ----------------------------------------- ");
                                fs.chmod("file.txt", 0o600, () => {
                                    console.log("\n The content of the file you are reading!\n");
                                    console.log(fs.readFileSync('file.txt', 'utf-8'));

                                }); 
                                break;
            default:
                console.log("This user doesn't exist");
                socket.write("Write something else please!");
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
 
//     var data = 'a string';
//     var file = './file';

//     fs.writeFile(file, data, function(err) {
//     if (err) throw err;
//     // file has been written to disk
//     });

//     // or synchronously writing a file
//     fs.writeFileSync(file, data);

//     // fetch the data asynchronously
//     fs.readFile(file, function(err, data) {
//     // we have "a string"
//     });

//     // synchronously reading a file
//     var str = fs.readFileSync(file);
    
    
    // In case errors happen
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    }); 
}); 

server.maxConnections = 4;

// Include Nodejs' net module.
const Net = require('net');
const fs = require('fs')
// The port on which the server is listening.
const port = 8080; 
const host = '127.0.0.1'; 

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
 
    var data = 'a string';
    var file = './file';

    fs.writeFile(file, data, function(err) {
    if (err) throw err;
    // file has been written to disk
    });

    // or synchronously writing a file
    fs.writeFileSync(file, data);

    // fetch the data asynchronously
    fs.readFile(file, function(err, data) {
    // we have "a string"
    });

    // synchronously reading a file
    var str = fs.readFileSync(file);
    
    
    // In case errors happen
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    }); 
}); 

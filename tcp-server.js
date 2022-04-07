// Include Nodejs' net module.
const Net = require('net');
// The port on which the server is listening.
const port = 8080;

// Create a new TCP server.
const server = Net.createServer(function(socket) {
	socket.write('Echo server created\r\n');
	socket.pipe(socket);
});

// The server listens to a socket for a client to make a connection request.
server.listen(port, function() {
    console.log(`Server listening for connection requests on socket 127.0.0.19:${port}`);
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    socket.write('Hello, client number 1');

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        console.log(`Data received from client 1: ${chunk.toString()}`);
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    // In case errors happen.
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
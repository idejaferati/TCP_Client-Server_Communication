// Include Nodejs' net module.
const Net = require('net');
const prompt = require('prompt-sync')();
// The port number and hostname of the server.
const port = 8484;
const host = '192.168.178.46'; 

// Create a new TCP client.
const client = new Net.Socket(); 

// Send a connection request to the server.
client.connect(port, host,function() { 
    // If there is no error, the server has accepted the request and created a new 
    // socket dedicated to client.
    console.log(`TCP connection established with the server on ${host}:${port}`+'\n'); 
}); 

// The client can also receive data from the server by reading from its socket.
client.on('data', function(chunk) {  
    console.log(`Data received from the server: ${chunk.toString()}`+'\n'); 
    
    // Request an end to the connection after entering exit in console
    if (chunk.toString().endsWith('exit')) { 
        client.destroy(); 
    } 

    if (!chunk.includes('/file read')) {
        var text = prompt("Write something: ");
        client.write(text);
    }  
});

// Add a 'close' event handler for the client socket 
client.on('close', () => { 
    console.log('Client closed'+'\n'); 
}); 

client.on('error', (err) => { 
    console.error(err); 
}); 

// Include Nodejs' net module.
const Net = require('net');
const prompt = require('prompt-sync')();
const { execFile } = require('child_process');
const process = require('process');

// The port number and hostname of the server.
const port = 8484;
//'192.168.43.116' - IDEJA
//192.168.43.162 - JETA L
//192.168.43.10 - JETA K
const host = '192.168.43.162'; 

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

    if (chunk.toString().includes('allowed to execute') && !chunk.toString().includes('not')) {
        const file = chunk.toString().split('---')[1];
        
        execFile(
            'cmd', [ '/c', 'start', '""', file ], { cwd: process.cwd() },
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

    
    if ((!chunk.includes('/file read') && !chunk.includes('/file list') && !chunk.includes('/file execute')) 
        || (chunk.includes('/file execute') && chunk.includes('.txt... '))) {
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

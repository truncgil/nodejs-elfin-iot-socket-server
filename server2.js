/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/

var net = require('net');
var clients = [];
var server = net.createServer(function(socket) {
//	socket.write("01 02 21 04 00 01 9E 37");
	//socket.pipe(socket);
    clients.push(socket);
    console.log(clients.length);
    socket.on('data',function(data){
        //message += data;
        console.log("reply ");
        console.log(data);
        broadcast(data,socket);
    });
    socket.on('end', function() {
        clients.splice(clients.indexOf(socket), 1);
       // console.log("\n\r" + socket.name + " left the chat." + "\n\r");
      });

    function broadcast(data,sender) {
        clients.forEach(function(client) {
            try {
                if(sender===client) return;
                console.log("broadcast send ");
                console.log(data);
                client.write(data);            
            } catch (error) {
                
            }
        });
      }
});

server.listen(5000);

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/


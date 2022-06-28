// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];
var client_ips = [];
var client_ids = [];


// Start a TCP Server
net.createServer(function(socket) {
  console.log(socket.remoteAddress);  
  // Identify this client
  var address = socket.remoteAddress === '::1' ? "localhost" : socket.remoteAddress;
  socket.name = address + ":" + socket.remotePort

  // Put this new client in the list
  client_ips.push(socket.remoteAddress);
  clients.push(socket);
  console.log(client_ips);
  let count = Object.keys(client_ips).length;
console.log(socket.name);
  // Send a nice welcome message and announce
  socket.write("Welcome " + socket.name + "\n\r");
  console.log(count + " cihaz bağlı");



  // my change here....

  
  var message = '';
  // Handle incoming messages from clients.
  socket.on('data', function(data) {
    client_ids[data] = socket;
  //  console.log(data);
    // copy incoming data to message
    message += data
    var n = message.indexOf('\n')
    // if we have a \n? in message then emit one or more 'line' events
    var is_private = message.indexOf('::');
    //console.log(is_private);
    if(is_private!=-1) {
        let split = message.split('::');
        let client_id = split[0];
        let private_message = split[1].trim(); 
        console.log("client_id:" + client_id);
        console.log("private_message:" + private_message);
        try {
            client_ids[client_id].write(private_message);
        } catch (error) {
            console.error("cihaz online değil veya yanlış id gönderilmiştir.");
            console.error(error);
        }
        
    }
    socket.emit('line', message.substring(0, n))
      message = message.substring(n + 1)
      n = message.indexOf('\n')
      console.log(n);
      /*
    while (~n) {
      socket.emit('line', message.substring(0, n))
      message = message.substring(n + 1)
      n = message.indexOf('\n')
      console.log(n);
    }
    */
  });

  // Broadcast on end of line
  socket.on('line', function() {
    broadcast(socket.name + "> " + message, socket);
    message = '';
  })

  // Remove the client from the list when it leaves
  socket.on('end', function() {
    clients.splice(clients.indexOf(socket), 1);
    broadcast("\n\r" + socket.name + " left the chat." + "\n\r");
  });

  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function(client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }

}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");
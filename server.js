// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];
var client_ips = [];
var client_ids = [];

function ascii_to_hex(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join(' ');
   }
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
 // var num = "0103210500019E37";
 // socket.write(num.toString(16).toUpperCase());
  //socket.write("Olimpiyat - Truncgil IOT TCP/Server v1.0");
  //console.log(count + " cihaz bağlı");



  // my change here....

  
  var message = '';
  var private_control = false;
  let client_id;
  // Handle incoming messages from clients.
  socket.on('data', function(data) {
    // copy incoming data to message
    console.log(data);
    broadcast(data, socket);
    message += data;
    var n = message.indexOf('\n');
    /*
    if(message.length==12) {
        client_ids[message] = socket;
        console.log("Client ID Login: " + message);
        socket.write("Welcome " + message + " register success");
        
    } else {
      //broadcast(message,socket);
       // console.log("client send: " + message + "\n");
    }
    */
    
  
    // if we have a \n? in message then emit one or more 'line' events
   // broadcast(message,socket);
   
    
    /*
    var is_private = message.indexOf('00 00 00');
     //console.log(is_private);
   if(is_private!=-1) {
        private_control = true;
        let split = message.split('00 00 00');
        console.log("split"+ split);
        client_id = split[0];
        private_message = split[1].trim(); 
        let sender = socket;
        console.log("client_id: " + client_id);
        console.log("register_code: " + private_message);
        try {
            let private_message_hex = ascii_to_hex(private_message);
           // console.log(private_message_hex);
         //   broadcast(private_message,sender);
            let sonuc = client_ids[client_id].write(private_message);
            console.log(sonuc);
            var yanit = '';
            client_ids[client_id].on('data',function(data){
                console.log("reply from: " + client_id);
                yanit += data;
                console.log(yanit);
                sender.write(yanit);
                yanit = '';
            });
            client_ids[client_id].on('error',function(err){
              console.log("error" + err);
              
            });
        } catch (error) {
            var error_message = "\nSend Error: " + client_id + '\n';
            console.error(error_message);
            console.error(error);
            sender.write(error_message);
        }
        
    }
    */
    
    
   // message = '';
    
     socket.emit('line', message)
      message = message.substring(n + 1)
      n = message.indexOf('\n')
    //  console.log(n);
    
      
    while (~n) {
      socket.emit('line', message)
      //message = message.substring(n + 1)
      n = message.indexOf('\n')
      console.log("line");
      console.log(n);
    }
    
    
  });

  // Broadcast on end of line
  
  socket.on('line', function() {
    /*
      var is_private = message.indexOf('::');
      
      if(is_private!=-1) {
          private_control = true;
          let split = message.split('::');
          client_id = split[0];
          private_message = split[1].trim(); 
          let sender = socket;
          console.log("client_id: " + client_id);
          console.log("register_code: " + private_message);
          try {
              let private_message_hex = ascii_to_hex(private_message);
              let sonuc = client_ids[client_id].write(private_message);
              console.log(sonuc);
              var yanit = '';
              client_ids[client_id].on('data',function(data){
                  console.log("reply from: " + client_id);
                  yanit += data;
                  console.log(yanit);
                  sender.write(yanit);
                  yanit = '';
              });
              client_ids[client_id].on('error',function(err){
                console.log("error" + err);
                
              });
          } catch (error) {
              var error_message = "\nSend Error: " + client_id + '\n';
              console.error(error_message);
              console.error(error);
              sender.write(error_message);
          }
          
      }
    */
  //  broadcast(data, socket);
    message = '';
  })
  

  socket.on('end', function() {
    clients.splice(clients.indexOf(socket), 1);
   // broadcast("\n\r" + socket.name + " left the chat." + "\n\r");
    console.log("\n\r" + socket.name + " left the chat." + "\n\r");
  });
  

  // Send a message to all clients
  function broadcast(data, sender) {
    try {
      clients.forEach(function(client) {

           // console.log(socket.name +" send message: " + data);
            client.write(data);
            client.on('data',function(data) {
              console.log(data);
            });
        
      });
    } catch (error) {
          
    }
      
   
    // Log it to the server output too
    process.stdout.write(message)
  }

}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");
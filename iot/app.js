var _ = require('lodash');
var net = require('net');
require('./lib/server');
var clients = [];
net.createServer(function(socket) {

    var broadcast = function(imei, message) {
        clients.forEach(function(client) {
            var client_imei = client.imei.toString();
            if (client_imei.trim() == imei) {
                console.log("imei to " + imei);
                message = message.replace(/\s/g, '');
              //  message = parseInt("01 03 21 05 00 01 9e 37", 16).toString();
             // message = message.toString(16);
                console.log(message);
                var buffer = new Buffer.from(message,'hex');
                console.log(buffer);
                
                client.write(buffer);
                client.on('data',function(return_data) {
                    console.log("reply data");
                    console.log(return_data);
                    try {
                        socket.write(return_data);
                    } catch (error) {
                        
                    }
                    
                   
                   client.end();
                   
                    
                });
                
            }
        });
    };
    function isJson(item) {
        item = typeof item !== "string"
            ? JSON.stringify(item)
            : item;
    
        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }
    
        if (typeof item === "object" && item !== null) {
            return true;
        }
    
        return false;
    }
    function isNumber(value) 
    {
        return typeof value === 'number' && isFinite(value);
    }

    socket.on('data', function(data) {
        var isJson =  data.indexOf('{');;
        if(isJson!=-1) {
            console.log("json data send");
            try {
                var device = JSON.parse(data.toString());
                broadcast(device.imei, device.command);
            } catch (error) {
                console.log(error);
            }
            
        } else {
            if (socket.remoteAddress !== '::ffff:127.0.0.1') {
                if (typeof socket.imei === 'undefined') {
                    if (setIMEI(data)) {
                        console.log("Device Connected " + data);
                        socket.write('Device Connected');
                    } else {
                        socket.write('Bad Command');
                    }
                } else {
                    clients.forEach(function(client) {
                        //if (client.remoteAddress === '::ffff:127.0.0.1') {
                            client.write(data);
                        //}
                    });
                }
            }
        }
        
    });

    socket.on('end', function() {
        var idx = clients.indexOf(socket);
        if (idx != -1) {
            delete clients[idx];
        }
    });

    var setIMEI = function(imei) {
        if (imei.toString().trim() !== '') {
            socket.imei = imei;
            clients.push(socket);
            console.log(clients.length);
            return true;
        } else {
            return false;
        }
    };

    //socket.write('Welcome to Truncgil IOT Server');

}).listen(5000, function() {
    console.log("Server running on port 5000");
});
 
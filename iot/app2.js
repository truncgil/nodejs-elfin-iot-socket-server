const secret_key = "olimpiyat_truncgil1854sa!";
var _ = require('lodash');
var net = require('net');
const axios = require('axios');
require('./lib/server');
var clients = [];

net.createServer(function(socket) {
    var hash = function(imei) {
        return require('crypto').createHash('sha256').update(secret_key+imei, 'binary').digest('hex');
    };
    var broadcast = function(imei, message) {
        try {
                if(typeof clients[imei] === 'undefined') {
                    socket.write("0");
                    console.log(imei+" device offline");
                } else {
                    let client = clients[imei];
                    console.log("imei to " + imei);
                    message = message.replace(/\s/g, '');
                    //  message = parseInt("01 03 21 05 00 01 9e 37", 16).toString();
                    // message = message.toString(16);
                    console.log(message);
                    var buffer = new Buffer.from(message,'hex');
                    console.log(buffer);
    
                    if (!client.destroyed) {
                        client.write(buffer);
                    } else {
                        console.log("client destroyed");
                        socket.write("0");
                    }
                    
                    sendLog(imei, message);
    
                    client.on('data',function(return_data) {
                        
                        
    
                        if (!socket.destroyed) {
                            socket.write(return_data);
                            console.log("reply data");
                            console.log(return_data);
                            sendLog(imei, return_data, message);
                           // return_data = null;
                        }
                        /*
                        try {
                            
                            
                        } catch (error) {
                            socket.write("not_reply");
                            
                        }
                        
                        */
                        //client.end();
                        //client.destroy();
                        
                        
                        
                        
                    }); 
                }
                
        } catch (error) {
            socket.write("");
        }
                
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
        var isJson =  data.indexOf('{');
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
                    
                    if(typeof clients[data] === 'undefined') {
                    
                        if (setIMEI(data)) {
                            console.log("Device Connected " + data);
                            if (!socket.destroyed) {
                                socket.write('Device Connected');
                            }
                        } else {
                            if (!socket.destroyed) {
                                socket.write('Bad Command');
                            }
                        }
                    } else {
                        console.log("device already connected");
                    }
                    
                } else {
                    /*
                    clients.forEach(function(client) {
                        //if (client.remoteAddress === '::ffff:127.0.0.1') {
                            client.write(data);
                        //}
                    });
                    */
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
    var sendLog = function(imei,text,from='') {
        text = text.toString('hex');
        text = encodeURIComponent(text);
        from = encodeURIComponent(from);
        
        var hash = getHash(imei);
        let url = 'https://app.olimpiyat.com.tr/manager/iot-connect';
        console.log(url);
        if(from!='') {
            axios
                .get(url,{
                    'imei' : imei,
                    'hash' : hash,
                    'log' : encodeURI(from+'->'+text),
                })
                .then(res => {
                //   console.log(`statusCode: ${res.status}`);
                //  console.log(res);
                console.log("sendLog from axios => "+ imei + " :: " + from + " :: " + text);
                })
                .catch(error => {
                    console.log("axios hatası");
                    console.error(error);
                });  
        }
        
    }
    var getHash = function(text) {
        return require('crypto').createHash('sha256').update(secret_key+text, 'binary').digest('hex');
    }
    var setIMEI = function(imei) {
        let hash = require('crypto').createHash('sha256').update(secret_key+imei, 'binary').digest('hex');
        let url = encodeURI('https://app.olimpiyat.com.tr/manager/iot-connect?imei='+imei+'&hash='+hash);

        if (imei.toString().trim() !== '') {
            //socket.imei = imei;
                axios
                    .get(url)
                    .then(res => {
                      //  console.log(`statusCode: ${res.status}`);
                      try {
                        var data = res.data;
                        console.log("stand up data sending...");
                        console.log(data);
                        data.forEach(function(command, i, a){
                            console.log(command);
                            socket.write('{"imei":"' + imei + '","command":"' + command + '"}');
                        });
                      } catch (error) {
                        
                      }
                        

                       console.log("device connected send from axios =>" + imei );
                    })
                    .catch(error => {
                        console.error(error);
                    });

            clients[imei] = socket;
            console.log("cihaz sayisi=" + clients.length);

            return true;
        } else {

            axios
                    .get(url)
                    .then(res => {
                       console.log("device reconnected send from axios =>" + imei );
                    })
                    .catch(error => {
                        console.error(error);
                    });
            return false;
        }
    };

    //socket.write('Welcome to Truncgil IOT Server');

}).listen(5000, function() {
    console.log("Server running on port 5000");
});
 
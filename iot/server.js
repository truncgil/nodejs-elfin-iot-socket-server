const secret_key = "olimpiyat_truncgil1854sa!";
var _ = require('lodash');
var net = require('net');
const axios = require('axios');
const port = 5000;

require('events').EventEmitter.prototype._maxListeners = 0;
require('events').EventEmitter.prototype.defaultMaxListeners  = 0;
require('events').EventEmitter.prototype.setMaxListeners = 0;//.setMaxListeners(0);


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
                    let sonuc = false;

                    
                    console.log(message);
                    var buffer = new Buffer.from(message,'hex');
                    console.log(buffer);
                    
                    

                    if (!client.destroyed) {
                        client.write(buffer);

                        client.on('data',function(return_data) {
                        
                        
    
                            if (!socket.destroyed) {
                                socket.write(return_data);
                                console.log("reply data");
                                console.log(return_data);
                                sendLog(imei, return_data, message);
                                sonuc = true;
                            // client.removeAllListeners("connect");
                            // return_data = null;
                            } else {
                            //    console.log("not reply socket destroy");
                            }
                        
                            
                            
                            
                            
                        }); 

                    } else {
                        console.log("client destroyed");
                        socket.write("0");
                    }
                  
                    
                    
                    // sendLog(imei, message);
                    var say = 0;
                    var timeoutSay = setInterval(() => {
                            say++;
                            if(say>3 && !sonuc) {
                                
                                if (!socket.destroyed) {
                                    console.log("reply timeout");
                                    console.log("deleting device");
                                    socket.write("0");
                                    delete clients[imei];
                                } else {
                                    //delete clients[imei];
                                }

                            //    delete clients[imei];
                                clearInterval(timeoutSay);
                            }
                        }, 1000);
                    
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

            let device = 0;

            try {
                device = JSON.parse(data.toString());
            } catch (error) {
                
            }

            if(device!=0) {

                try {        
                    broadcast(device.imei, device.command);
                } catch (error) {
                    
                    console.log(data);
                    console.log(error);
                }
            }
            
            
        } else {
            if (socket.remoteAddress !== '::ffff:127.0.0.1') {

                if (typeof socket.imei === 'undefined') {
                    
                    if(typeof clients[data] === 'undefined') {
                        
                        if (setIMEI(data)) {
                            console.log("Device Connected " + data);
                            
                            if (!socket.destroyed) {
                                socket.imei = data;
                                socket.write('Device Connected');
                            }
                        } else {
                            if (!socket.destroyed) {
                                socket.write('Bad Command');
                            }
                        }
                    } else {
                        setIMEI(data);
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
        console.log("end");
        
        if (socket.imei !== undefined) {
            console.log("disconnect " + socket.imei);
            delete clients[socket.imei];
        }
        
    });
    socket.on('destroy', function() {
        console.log("destroy");
        
        if (socket.imei !== undefined) {
            console.log("destroy " + socket.imei);
            delete clients[socket.imei];
        }
        
    });
    socket.on('close', function() {
        console.log("close");
        
        if (socket.imei !== undefined) {
            console.log("destroy " + socket.imei);
            delete clients[socket.imei];
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
                    console.log("axios error");
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
        
        
        //console.log("cihaz sayisi=" + clients.length);
      //  console.log(imei.length);
        imei = imei.toString().trim();
        if (imei !== '') {

            if(imei.length==12) {
                try {
                    clients[imei].close();
                } catch (error) {
                    
                }
                setTimeout(function() {
                    clients[imei] = socket;
                    //socket.imei = imei;
                        axios
                            .get(url)
                            .then(res => {
                              //  console.log(`statusCode: ${res.status}`);
                              try {
                                var data = res.data;
                                console.log(data);
                                if(Array.isArray(data)) {
                                    console.log("stand up data sending...");
                                    console.log(data);
                                    let k = 0;
                                    data.forEach(function(command, i, a){
    
                                        console.log(command);
                                        setTimeout(function(){
                                            console.log("send " + command);
                                            command = command.replace(/\s/g, '');
                                            var buffer = new Buffer.from(command,'hex');
                                            socket.write(buffer);
                                            socket.on('data' ,function(return_data){
                                                console.log("return " + return_data.toString('hex'));
                                            });
                                          //  broadcast('{"imei":"' + imei + '","command":"' + command + '"}');
                                        }, 1000*k);
                                        k++;
                                    });
                                }
                                
                              } catch (error) {
                                console.log(error);
                              }
                                
        
                               console.log("device connected send from axios =>" + imei );
                            })
                            .catch(error => {
                                console.error(error);
                            });
                },1000);
                
    
                
    
                return true;
            } else {
                socket.write(imei + " " + imei.length +" IMEI error");
                return false;
            }
            
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

}).listen(port, function() {
    console.log("Truncgil Server running on port " + port);
});
 
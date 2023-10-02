var net = require('net');

var client = new net.Socket();
client.connect(5000, '127.0.0.1', function() {
	console.log('Connected');
    var data = {
        imei : "344041073520",
        command : "01 03 21 05 00 01 9E 37"
    }
	client.write(JSON.stringify(data));
});

client.on('data', function(data) {
    data = Buffer.from(data, 'utf8').toString('hex');
	console.log('Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});
/*
import { createServer } from "https";
import { Server } from "socket.io";
*/
var fs = require('fs');

const privateKey = fs.readFileSync('/etc/pki/tls/private/app.olimpiyat.com.tr.key', 'utf8')
const certificate = fs.readFileSync('/etc/pki/tls/certs/app.olimpiyat.com.tr.cert', 'utf8')
const credentials = {
    key: privateKey, 
    cert: certificate
}

const httpServer = require("https").createServer(credentials);

const io = require("socket.io")(httpServer,  {
    origin : "https://app.olimpiyat.com.tr",
    methods: ["GET", "POST"]
});

io.on("connection", (socket) => {
 // console.log(socket);
  socket.to("data").emit();
});



httpServer.listen(3000);
import { createServer } from "https";
import { Server } from "socket.io";


var options = {
    key:    require('fs').readFileSync('/etc/ssl/certs/app.olimpiyat.com.tr.bundle'),
    cert:   require('fs').readFileSync('/etc/ssl/certs/app.olimpiyat.com.tr.cert')
};
const httpServer = createServer(options);
const io = new Server(httpServer,  {
    origin : "https://app.olimpiyat.com.tr",
    methods: ["GET", "POST"]
});

io.on("connection", (socket) => {
  console.log('a user connected'); 
});


httpServer.listen(3000);
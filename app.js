const server = require('http').createServer();
var cors_settings = {
  cors: {
    origin: "http://app.olimpiyat.com.tr",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
};
console.log("cors settings");
console.log(cors_settings);
const io = require("socket.io")(server, cors_settings);
console.log("wait client");
io.engine.on("connection_error", (err) => {
  console.log(err);
});
io.on("/",function(socket) {
  console.log("welcome");
});
io.on('connection',function(socket){
    console.log("online");
//    console.log(socket);
    
    socket.on('send-message',function(data){
        console.log(data);
        io.emit('message',data);
    });
    

    socket.on('disconnect',function(){
        console.log("offline");
    });

});
server.listen(1988);
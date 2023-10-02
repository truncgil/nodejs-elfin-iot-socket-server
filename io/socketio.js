import { createServer } from "../http";
import { Server } from "../socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});

io.on("connection", (socket) => {
  console.log('a user connected'); 
});

httpServer.listen(3000);
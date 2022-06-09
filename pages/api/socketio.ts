import { Server } from "socket.io";
let isConnected = false
const ioHandler = (_req: any, res: any) => {
  if(!isConnected){
    isConnected = true
    const io = new Server(res.socket.server);
    console.log("*First use, starting socket.io");
    io.on("connection", (socket) => {
      console.log('소켓시작')
      socket.broadcast.emit("a user connected");
      socket.on("message", (body) => {
        const {name,message} = body
        console.log(`[${name}] - got message : ${message}`);
        console.log(`현재인원 : ${socket.conn.server.clientsCount}`);
        console.log('---');
        
        io.emit("message", body)
      });
    });
  }
  res.status(200).json({message:'socket connected'})
};
export default ioHandler;

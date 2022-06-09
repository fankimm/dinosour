import { Server } from "socket.io";
const ioHandler = (_req: any, res: any) => {
  // console.log(res.socket.server.io);
  interface IHistory {
    name:string;
    message:string;
  }
  const history:IHistory[] = []
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");
      socket.on("message", (body) => {
        const {name,message} = body
        history.push({name,body })
        socket.broadcast.emit(history)
        console.log(`[${name}] - got message : ${message}`);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;

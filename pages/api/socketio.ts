import { Server } from "socket.io";
const ioHandler = (_req: any, res: any) => {
  // console.log(res.socket.server.io);
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");
      socket.on("message", (body) => {
        console.log(`[${body.name}] - got message : ${body.message}`);
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

import { Server, Socket } from "socket.io";
import moment from "moment";
let isConnected = false;

const ioHandler = (req: any, res: any) => {
  if (!isConnected) {
    isConnected = true;
    const io = new Server(res.socket.server);
    console.log("*First use, starting socket.io");
    io.on("connection", (socket) => {
      console.log(Object.keys(socket.rooms));
      console.log(socket.rooms);

      console.log(`socket-id : ${socket.id}`);
      let tempColor = "";
      for (let i = 0; i < 3; i++) {
        if (i === 2) {
          tempColor += Math.floor(Math.random() * 256).toString();
        } else {
          tempColor += Math.floor(Math.random() * 256).toString() + ",";
        }
      }
      const {
        sockets: {
          adapter: { sids, rooms },
        },
      } = io;
      const personalInfo = { id: socket.id, color: tempColor };
      io.emit("profile", personalInfo);
      socket.on("disconnect", () => {
        console.log("user has left");
      });
      console.log("소켓시작");
      console.log("---");
      socket.on("message", (body) => {
        const { name, message } = body;
        const msg = {
          name,
          message,
          color: tempColor,
          time: moment().format("LT"),
        };
        console.log(`[${name}] - got message : ${message}`);
        // console.log(`현재인원 : ${socket.conn.server.clientsCount}`);
        console.log("---");

        io.emit("message", msg);
      });
    });
  }
  res.status(200).json({ message: "socket connect success" });
};
export default ioHandler;

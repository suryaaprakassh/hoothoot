import { Socket } from "socket.io";

export default (io: any) => {
  io.on("connection", (socket: Socket) => {
    console.log("connected to socket");

    io.on("disconnect", () => {
      console.log("Disconnected");
    });
  });
};

import { Socket } from "socket.io";

type roomType = {
  pin: string;
  hostRoom: string;
  clientRoom: string;
};

export default (io: any) => {
  let rooms: roomType[] = [];

  io.on("connection", (socket: Socket) => {
    console.log("connected to socket");

    socket.on("create-game", (gamePin: string) => {
      const room = rooms.find((room) => room.pin === gamePin);
      if (room) {
        socket.join(room.hostRoom);
      } else {
        rooms.push({
          pin: gamePin,
          hostRoom: `host-${gamePin}`,
          clientRoom: `client-${gamePin}`,
        });

        socket.join(`host-${gamePin}`);
      }
      socket.data.gamePin = gamePin;
      socket.data.type = "host";
    });

    socket.on("join-game", (data: { gamePin: string; playerName: string }) => {
      const { gamePin, playerName } = data;
      const room = rooms.find((room) => room.pin === gamePin);
      if (room) {
        socket.join(room.clientRoom);
        io.to(room.hostRoom).emit("player-joined", playerName);
        socket.data.gamePin = gamePin;
        socket.data.type = "client";
      } else {
        socket.emit("invalid-pin");
        console.log("invalid-pin=======");
      }
    });

    socket.on("disconnect", () => {
      if (socket.data.type === "host") {
        //TODO: Delete room
        rooms = rooms.filter((room) => room.pin !== socket.data.gamePin);
      }
      console.log("Disconnected");
    });
  });
};

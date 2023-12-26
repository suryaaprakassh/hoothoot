import { Socket } from "socket.io";
import { verifyToken } from "../lib/utils";

type ClientType = {
  id: string;
  name: string;
};

type roomType = {
  pin: string;
  hostRoom: string;
  clientRoom: string;
  clients: ClientType[];
};

export default (io: any) => {
  let rooms: Map<string, roomType> = new Map();

  io.on("connection", async (socket: Socket) => {
    let token;

    socket.handshake.headers.cookie?.split(";").forEach((cookie) => {
      if (cookie.includes("token")) {
        token = cookie.split("=")[1];
      }
    });

    const user = await verifyToken(token);
    socket.data.user = user;
    socket.on("create-game", (gamePin: string) => {
      const room = rooms.get(gamePin);
      if (room) {
        socket.join(room.hostRoom);
      } else {
        rooms.set(gamePin, {
          pin: gamePin,
          hostRoom: `host-${gamePin}`,
          clientRoom: `client-${gamePin}`,
          clients: [],
        });

        socket.join(`host-${gamePin}`);
      }
      socket.data.gamePin = gamePin;
      socket.data.type = "host";
    });

    socket.on("join-game", (data: { gamePin: string; playerName: string }) => {
      const { gamePin, playerName } = data;
      const room = rooms.get(gamePin);
      if (room) {
        socket.join(room.clientRoom);
        socket.data.gamePin = gamePin;
        socket.data.type = "client";
        if (
          room.clients.every(
            (client: ClientType) => client.id !== socket.data.user.id
          )
        ) {
          io.to(room.hostRoom).emit("player-joined", {
            name: playerName,
            id: socket.data.user.id,
          });
          room.clients.push({
            name: playerName,
            id: socket.data.user.id,
          });
        }
      } else {
        console.log("rooms====>", rooms);
        socket.emit("invalid-pin");
      }
    });

    socket.on("disconnect", () => {
      if (socket.data.type === "host") {
        //TODO: Delete room
        rooms.delete(socket.data.gamePin);
      } else {
        io.to(`host-${socket.data.gamePin}`).emit("player-disconnected", {
          id: socket.id,
        });
        const room = rooms.get(socket.data.gamePin)!;
        room.clients = room?.clients.filter(
          (client: ClientType) => client.id !== socket.data.user.id
        );
      }
      console.log("Disconnected");
    });
  });
};

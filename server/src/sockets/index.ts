import { Socket } from "socket.io";
import { verifyToken } from "../lib/utils";
import prisma from "../lib/db";

type ClientType = {
  id: string;
  name: string;
  score: number;
};

type roomType = {
  pin: string;
  hostRoom: string;
  clientRoom: string;
  clients: ClientType[];
  started: boolean;
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
          started: false,
        });

        socket.join(`host-${gamePin}`);
      }
      socket.data.gamePin = gamePin;
      socket.data.type = "host";
    });

    socket.on("join-game", (data: { gamePin: string; playerName: string }) => {
      const { gamePin, playerName } = data;
      const room = rooms.get(gamePin);
      if (room?.started) {
        socket.emit("invalid-pin");
        return;
      }
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
            score: 0,
          });
        }
      } else {
        console.log("rooms====>", rooms);
        socket.emit("invalid-pin");
      }
    });

    socket.on("start-game", async () => {
      const room = rooms.get(socket.data.gamePin);
      const game = await prisma.game.findUnique({
        where: {
          pin: socket.data.gamePin,
        },
        include: { Questions: true },
      });
      const questions = game?.Questions;
      if (!questions) return;
      if (room) {
        room.started = true;
        io.to(room.clientRoom).emit("start-game");
      }
      socket.emit("new-question", {
        question: questions[0].question,
        options: [
          { val: questions[0].opt1, key: "opt1" },
          { val: questions[0].opt2, key: "opt2" },
          { val: questions[0].opt3, key: "opt3" },
          { val: questions[0].opt4, key: "opt4" },
        ],
      });
      io.to(room?.clientRoom).emit("new-question", {
        question: "test-question",
      });

      let count = 2;
      const gameInterval = setInterval(() => {
        if (count == questions.length) {
          clearInterval(gameInterval);
          socket.emit("game-end");
          io.to(room?.clientRoom).emit("game-end", {
            question: "test-question",
          });
          return;
        }
        console.log(questions[count]);
        socket.emit("new-question", {
          question: questions[count].question,
          options: [
            { val: questions[count].opt1, key: "opt1" },
            { val: questions[count].opt2, key: "opt2" },
            { val: questions[count].opt3, key: "opt3" },
            { val: questions[count].opt4, key: "opt4" },
          ],
        });
        io.to(room?.clientRoom).emit("new-question", {
          question: "test-question",
        });
        count++;
      }, 30000);
    });

    socket.on("disconnect", () => {
      if (socket.data.type === "host") {
        //TODO: Delete room
        rooms.delete(socket.data.gamePin);
        console.log("host disconnected");
      } else {
        io.to(`host-${socket.data.gamePin}`).emit("player-disconnected", {
          id: socket.id,
        });
        const room = rooms.get(socket.data.gamePin)!;
        if (!room) return;
        room.clients = room?.clients.filter(
          (client: ClientType) => client.id !== socket.data.user.id
        );
      }
      console.log("Disconnected");
    });
  });
};

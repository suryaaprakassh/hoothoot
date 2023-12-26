import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { router as authRouter } from "./routes/auth";
import { router as gameRouter } from "./routes/game";
import initializeSockets from "./sockets/index";

import "dotenv/config";

import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

initializeSockets(io);

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/game", gameRouter);

app.get("/", (req, res) => {
  res.send("ok");
});

server.listen(8000, () => {
  console.log("listening on port 8000....");
});

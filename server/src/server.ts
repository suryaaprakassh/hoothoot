import express from "express";
import cors from "cors";
import { router as authRouter } from "./routes/auth";
import { router as gameRouter } from "./routes/game";

import "dotenv/config";

import cookieParser from "cookie-parser";
import AuthMiddleware from "./middlewares/AuthMiddleware";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/game", AuthMiddleware, gameRouter);

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(8000, () => {
  console.log("listening on port 8000....");
});

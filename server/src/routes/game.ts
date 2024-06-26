import express from "express";
import { Request, Response } from "express";
import prisma from "../lib/db";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { questionSchemaArray } from "../schemas/schema";
export const router = express.Router();

router.use(AuthMiddleware);

router.get("/getAll", async (req, res) => {
  const reqBody = req.body;

  const user = await prisma.users.findUnique({
    where: {
      email: req.user?.email,
    },
  });

  if (!user) {
    return res.status(500).json({ message: "User Not Found" });
  }

  const games = await prisma.game.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      userId: user?.id,
    },
  });

  return res.status(200).json({ status: "success", gameData: games });
});

router.post("/create", async (req, res) => {
  const body = req.body;
  if (!body.gameName || body.gameName == "") {
    return res.json({
      status: 503,
      message: "Not a valid game Name",
    });
  }
  const user = await prisma.users.findUnique({
    where: {
      email: req.user?.email,
    },
  });

  if (!user) {
    return res.json({
      status: 503,
      message: "Not a valid user",
    });
  }

  const game = await prisma.game.create({
    data: {
      name: body.gameName,
      user: {
        connect: {
          email: req.user?.email,
        },
      },
    },
  });

  res.json({
    message: "Game Created Successfully",
    id: game.id,
    status: 201,
  });
});

router.post("/verify", async (req: Request, res: Response) => {
  const id = parseInt(req.body.id);
  const game = await prisma.game.findUnique({
    where: {
      id: id,
    },
  });

  console.log("game=====>", game);

  return res.status(200).send("ok");
});

router.post("/add", async (req: Request, res: Response) => {
  const questionsData = questionSchemaArray.safeParse(req.body.questions);
  if (!questionsData.success) {
    console.log(questionsData.error.message);
    return res.status(501).json({
      message: "Invalid Data format",
      success: false,
    });
  }
  const questions = questionsData.data;
  const gameId = parseInt(req.body.gameId);

  const dbQuestions = await prisma.question.createMany({
    data: questions.map((q) => {
      return {
        ...q,
        gameId: gameId,
      };
    }),
  });

  return res.json({
    data: "Ok",
    queryCount: dbQuestions,
  });
});

router.post("/getGamePin", async (req, res) => {
  const gameId = parseInt(req.body.gameId);
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });
  if (!game) {
    return res.status(500).json({ status: "error", message: "Game not found" });
  }

  if (game.pin !== "") {
    return res.status(200).json({ status: "success", gamePin: game.pin });
  }
  const newPin = Math.floor(Math.random() * 1000000);

  await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      pin: newPin.toString(),
    },
  });

  return res.status(200).json({ status: "success", gamePin: newPin });
});

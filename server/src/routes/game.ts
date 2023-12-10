import express from "express";
import prisma from "../lib/db";
export const router = express.Router();

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

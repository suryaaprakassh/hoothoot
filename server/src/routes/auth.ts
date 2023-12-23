import express from "express";
import prisma from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { signupSchema } from "../schemas/schema";
export const router = express.Router();

const salt = bcrypt.genSaltSync(10);

router.post("/signup", async (req, res) => {
  const reqData = signupSchema.safeParse(req.body);

  if (!reqData.success) {
    console.log(reqData.error.message);
    return res.status(501).json({
      message: "Invalid Data format",
      success: false,
    });
  }

  const user = reqData.data;

  const encryptedPassword = await bcrypt.hash(user.password, salt);

  const dbuser = await prisma.users.findUnique({
    where: {
      email: user.email,
    },
  });

  if (dbuser) {
    return res.status(500).json({
      message: "User already registered",
      success: false,
    });
  }

  const newUser = await prisma.users.create({
    data: {
      email: user.email,
      name: user.name,
      password: encryptedPassword,
    },
  });

  return res.status(201).json({
    message: "User created successfully",
    success: true,
  });
});

router.post("/login", async (req, res) => {
  const data = req.body;
  if (!data.email || !data.password) {
    return res.status(500).json({
      message: "Login Failed",
      success: false,
    });
  }

  const user = await prisma.users.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return res.status(500).json({
      message: "Invalid Email or Password",
      success: false,
    });
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) {
    return res.status(500).json({
      message: "Invalid Email or Password",
      success: false,
    });
  }
  const token = jwt.sign(
    {
      email: user.email,
      name: user.name,
      id: user.id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
  return res
    .status(200)
    .cookie("token", token, {
      maxAge: 60 * 60 * 24 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({
      message: "Login Success",
      success: true,
    });
});
router.post("/verify", async (req, res) => {
  const token = req.cookies["token"];
  if (!token || token == undefined) {
    return res.status(403).clearCookie("token").json({
      message: "Invalid Token",
    });
  }
  try {
    if (!jwt.verify(token, process.env.JWT_SECRET!)) {
      throw new Error("invalid token");
    }
    const tokenData: any = jwt.decode(token);
    const dbuser = await prisma.users.findUnique({
      where: {
        email: tokenData.email!,
      },
    });
    if (!dbuser) {
      throw new Error("invalid token");
    }

    return res.status(200).send();
  } catch (err: any) {
    console.log(err);
    return res.status(403).clearCookie("token").json({
      message: "Invalid Token",
    });
  }
});

router.post("/logout", AuthMiddleware, async (_req, res) => {
  return res.status(200).clearCookie("token").send();
});

import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
export interface UserType {
  email: string;
  name: string;
  iat: number;
  exp: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["token"];
  console.log("res cookies=======", req.cookies);
  if (!token) {
    return res.json({
      status: 403,
      message: "Login To continue",
    });
  }

  if (!jwt.verify(token, process.env.JWT_SECRET!)) {
    return res.json({
      status: 403,
      message: "Login To continue",
    });
  }
  const user = jwt.decode(token);

  req.user = user as UserType;
  next();
};

export default AuthMiddleware;

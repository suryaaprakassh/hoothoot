import jwt from "jsonwebtoken";
export const verifyToken = (token: string | undefined) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user;
  } catch (err) {
    console.log("error=====>", err);
    throw new Error("invalid token");
  }
};

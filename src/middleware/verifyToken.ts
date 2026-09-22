import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.accessToken) {
    res.status(401).send();
    return;
  }

  jwt.verify(
    req.cookies.accessToken,
    process.env.JWT_SECRET || "",
    async (
      error: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined,
    ) => {
      if (
        error ||
        !decoded ||
        typeof decoded === "string" ||
        typeof decoded.userId !== "string"
      ) {
        res.status(403).send();
        return;
      }

      try {
        const user = await User.findById(decoded.userId).select("_id is_admin");

        if (!user) {
          res.status(401).send();
          return;
        }

        res.locals.userId = user._id.toString();
        res.locals.isAdmin = user.is_admin;

        next();
      } catch (error) {
        res.status(500).send();
      }
    },
  );
};

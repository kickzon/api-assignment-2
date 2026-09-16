import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.accessToken) {
    res.status(401).send();
    return;
  }

  jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET || "", (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (
      error ||
      !decoded ||
      typeof decoded === "string" ||
      typeof decoded.userId !== "string"
    ) {
      res.status(403).send();
      return;
    }

    res.locals.userId = decoded.userId;
    next();
  });
};
import { NextFunction, Request, Response } from "express";

export const requireAdmin = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.locals.isAdmin !== true) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
};
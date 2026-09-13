import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  
  if (!req.cookies.accessToken) {
    res.status(401).send()
    return
  }

  jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET || "", (error: jwt.VerifyErrors | null) => {
    if (error) {
      res.status(403).send()
      return
    }

    next()
  })
}

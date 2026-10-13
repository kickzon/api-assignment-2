import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";

const useSecureCookies =
  process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};
  if (username === undefined || password === undefined) {
    res.status(400).json({ message: "username and password are required" });
    return;
  }

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ message: "username and password must be strings" });
    return;
  }

  const normalizedUsername = username.trim();

  if (!normalizedUsername || !password) {
    res.status(400).json({
      message: "username and password are required",
    });
    return;
  }

  const user = await User.findOne({ username: normalizedUsername });

  if (!user) {
    res.status(401).json({ message: "username/password are wrong" });
    return;
  }

  const hashedPassword = user.password;

  const isLoggedIn = await bcrypt.compare(password, hashedPassword);
  if (isLoggedIn) {
    const accessToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ message: "You are logged in", isLoggedIn: isLoggedIn });
    return;
  } else {
    res.status(401).json({ message: "username/password are wrong" });
    return;
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({
      message: "username and password are required",
    });
    return;
  }

  const normalizedUsername = username.trim();

  if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
    res.status(400).json({
      message: "username must contain between 3 and 30 characters",
    });
    return;
  }

  if (password.length < 8 || password.length > 72) {
    res.status(400).json({
      message: "password must contain between 8 and 72 characters",
    });
    return;
  }

  try {
    const existingUser = await User.findOne({
      username: normalizedUsername,
    });

    if (existingUser) {
      res.status(409).json({
        message: "username already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: normalizedUsername,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "You are registered",
      user: {
        username: normalizedUsername,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax",
  });
  res.json({ message: "You are logged out" });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      _id: user._id,
      username: user.username,
      is_admin: user.is_admin,
      created_at: user.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

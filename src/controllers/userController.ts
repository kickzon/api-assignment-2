import { Request, Response } from "express";
import User from "../models/user";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password"); // Exclude the password field from the response
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password"); // Exclude the password field from the response
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};
import express from "express";
import { getAllUsers, getUserById, updateUser } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.patch("/:id", verifyToken, updateUser);

export default router;
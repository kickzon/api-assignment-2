import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);

export default router;
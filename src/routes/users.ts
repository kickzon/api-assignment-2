import express from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.delete("/:id", verifyToken, deleteUser);
router.patch("/:id", verifyToken, updateUser);

export default router;
import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
} from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

router.get("/", verifyToken, requireAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.delete("/:id", verifyToken, deleteUser);
router.patch("/:id/role", verifyToken, requireAdmin, updateUserRole);
router.patch("/:id", verifyToken, updateUser);

export default router;
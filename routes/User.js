import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // every route below requires login

router.get("/profile", getUserProfile);
router.get("/", restrictTo("admin"), getAllUsers);
router.get("/:id", restrictTo("admin"), getUserById);
router.patch("/:id", restrictTo("admin"), updateUser);
router.delete("/:id", restrictTo("admin"), deleteUser);

export default router;

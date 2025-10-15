// routes/profileRoutes.js
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // optional auth middleware

const router = express.Router();

router.get("/:id", authMiddleware, getProfile);
router.put("/:id", authMiddleware, updateProfile);

export default router;

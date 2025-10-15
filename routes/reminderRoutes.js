
import express from "express";
import {
  addReminder,
  getReminders,
  getReminder,
  editReminder,
  removeReminder,
} from "../controllers/reminderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addReminder);
router.get("/", getReminders);
router.get("/:id", getReminder);
router.put("/:id", editReminder);
router.delete("/:id", removeReminder);

export default router;
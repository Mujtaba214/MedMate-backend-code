import express from "express";
import authMiddleware  from "../middleware/authMiddleware.js";
import {
  addFamilyMember,
  deleteFamilyMember,
  getFamilyMember,
  updateFamilyMember,
} from "../controllers/familyController.js";

const router = express.Router();


router.post("/", authMiddleware, addFamilyMember);
router.get("/", authMiddleware, getFamilyMember);
router.put("/:id", authMiddleware, updateFamilyMember);
router.delete("/:id", authMiddleware, deleteFamilyMember);

export default router;

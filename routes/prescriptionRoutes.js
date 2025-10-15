  import express from "express";
  import authMiddleware  from "../middleware/authMiddleware.js";
  import upload from "../middleware/uploadMiddleware.js";
  import {
    addPrescription,
    deletePrescription,
    getPrescriptionById,
    getPrescriptions,
    updatePrescription,
  } from "../controllers/prescriptionController.js";

  const router = express.Router();

  router.post("/", authMiddleware, upload.single("image"), addPrescription);

  // Get all prescriptions for logged-in user
  router.get("/", authMiddleware, getPrescriptions);

  // Get prescriptions by family member
  router.get("/family/:familyId", authMiddleware, getPrescriptions);
  router.put("/:id", authMiddleware, upload.single("image"), updatePrescription);
  router.get("/:id", authMiddleware, getPrescriptionById);
  router.delete("/:id", authMiddleware, deletePrescription);

  export default router;

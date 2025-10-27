import query from '../db/db.js';
import * as Prescription from '../models/Prescription.js'


export const addPrescription = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { medicine, dosage, duration, doctor, familyId } = req.body;
    const image_url = req.file ? req.file.path : null; 

    if (!medicine || !dosage || !duration || !doctor) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPrescription = await Prescription.createPrescription({
      userId,
      familyId: familyId || null,
      medicine,
      dosage,
      duration,
      doctor,
      image_url: image_url, 
    });

    res.status(201).json(newPrescription);
  } catch (error) {
    console.error("❌ Error adding prescription:", error);
    res.status(500).json({ error: error.message });
  }
};



export const getPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { familyId } = req.params; 

    let prescriptions;

    if (familyId) {
      prescriptions = await Prescription.getPrescriptionsByFamily(familyId, userId);
    } else {
      prescriptions = await Prescription.getAllPrescriptionsByUser(userId);
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  console.log("🎯 getPrescriptionById called with", req.params.id);
  try {
    const { id } = req.params;
    const prescription = await Prescription.getPrescriptionById(id, req.user.id);
    if (!prescription) {
      console.log("❌ Prescription not found for", id, "user", req.user.id);
      return res.status(404).json({ error: "Prescription not found" });
    }
    res.status(200).json(prescription);
  } catch (error) {
    console.error("❌ Error fetching prescription:", error);
    res.status(500).json({ error: error.message });
  }
};



export const updatePrescription = async (req, res) => {
  try {
    const { medicine, dosage, duration, doctor } = req.body;
    const user_id = req.user.id;
    const { id } = req.params;

    let image_url = null;
    if (req.file) {
      image_url = `uploads/${req.file.filename}`;
    }

    const existing = await query(
      "SELECT * FROM prescriptions WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const finalImage = image_url || existing.rows[0].image_url;

    const updated = await query(
      `UPDATE prescriptions
       SET medicine = $1, dosage = $2, duration = $3, doctor = $4, image_url = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [medicine, dosage, duration, doctor, finalImage, id, user_id]
    );

    return res.json({
      success: true,
      message: "✅ Prescription updated successfully",
      data: updated.rows[0],
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    await Prescription.deletePrescription(req.params.id, req.user.id);
    res.json({ message: "Prescription deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
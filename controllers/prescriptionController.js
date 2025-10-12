import * as Prescription from '../models/Prescription.js'


export const addPrescription = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { medicine, dosage, duration, doctor, familyId } = req.body;
    const image_url = req.file ? req.file.path : null; // ✅ changed from image → image_url

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
      image_url: image_url, // ✅ match with DB column
    });

    res.status(201).json(newPrescription);
  } catch (error) {
    console.error("❌ Error adding prescription:", error);
    res.status(500).json({ error: error.message });
  }
};



export const getPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { familyId } = req.params; // optional

    let prescriptions;

    if (familyId) {
      // Get prescriptions for a specific family member (and ensure ownership)
      prescriptions = await Prescription.getPrescriptionsByFamily(familyId, userId);
    } else {
      // Get all prescriptions for the logged-in user (including family)
      prescriptions = await Prescription.getAllPrescriptionsByUser(userId);
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ error: error.message });
  }
};


export const updatePrescription = async (req, res) => {
  try {
    const { medicine, dosage, duration, doctor } = req.body;
    const imageUrl = req.file ? `/uploads/prescriptions/${req.file.filename}` : null;

    const updated = await Prescription.updatePrescription(req.params.id, req.user.id, {
      medicine, dosage, duration, doctor, imageUrl
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

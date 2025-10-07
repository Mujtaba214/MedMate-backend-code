import * as Prescription from '../models/Prescription.js'

export const addPrescription = async (req, res) => {
  try {
    const { familyId, medicine, dosage, duration, doctor } = req.body;
    const imageUrl = req.file ? `/uploads/prescriptions/${req.file.filename}` : null;

    const prescription = await Prescription.createPrescription(familyId, {
      medicine, dosage, duration, doctor, imageUrl
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const { familyId } = req.params;
    const prescriptions = await Prescription.getPrescriptionsByFamily(familyId, req.user.id);
    res.json(prescriptions);
  } catch (error) {
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

import * as Family from "../models/Family.js";

export const addFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const member = await Family.createFamilyMember(userId, req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const member = await Family.getFamilyMembersByUser(userId);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const member = await Family.updateFamilyMember(
      req.params.id,
      userId,
      req.body
    );
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    await Family.deleteFamilyMember(req.params.id, userId);
    res.status(201).json({ msg: " Family member deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

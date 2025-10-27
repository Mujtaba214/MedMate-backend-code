import { getUserById, updateUserById } from "../models/Users.js";

export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error("❌ getProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateUserById(req.params.id, req.body);
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("❌ updateProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

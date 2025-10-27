import {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
} from "../models/Reminder.js";
import { getUserById } from "../models/Users.js";
import { getPrescriptionById } from "../models/Prescription.js";
import { getFamilyMemberById } from "../models/Family.js";
import { scheduleReminderEmail } from "../utils/sendEmail.js";

export const addReminder = async (req, res) => {
  try {
    const {
      family_member_id,
      prescription_id,
      reminder_time,
      note,
      repeat_type = "once",
      repeat_days = [],
    } = req.body;
    const user_id = req.user.id;

    const reminder = await createReminder({
      user_id,
      family_member_id,
      prescription_id,
      reminder_time,
      note,
      repeat_type,
      repeat_days,
    });

    const user = await getUserById(user_id);
    const prescription = await getPrescriptionById(prescription_id);
    const familyMember = await getFamilyMemberById(family_member_id);

    const medicineName =
      prescription?.medicine_name ||
      prescription?.medicine ||
      prescription?.name ||
      "Unknown Medicine";

    const familyMemberName = familyMember?.name || "";

    await scheduleReminderEmail(
      user.email,
      medicineName,
      familyMemberName,
      reminder_time,
      note
    );

    res.status(201).json({
      success: true,
      message: "✅ Reminder added successfully.",
      data: reminder,
    });
  } catch (err) {
    console.error("❌ Error adding reminder:", err);
    res.status(500).json({
      success: false,
      message: "Error adding reminder",
      error: err.message,
    });
  }
};

export const getReminders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const reminders = await getAllReminders(user_id);
    res.json({ success: true, data: reminders });
  } catch (err) {
    console.error("❌ Error fetching reminders:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching reminders" });
  }
};

export const getReminder = async (req, res) => {
  try {
    const reminder = await getReminderById(req.params.id);
    if (!reminder)
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });

    res.json({ success: true, data: reminder });
  } catch (err) {
    console.error("❌ Error fetching reminder:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching reminder" });
  }
};

export const editReminder = async (req, res) => {
  try {
    const updated = await updateReminder(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ Error updating reminder:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating reminder" });
  }
};

export const removeReminder = async (req, res) => {
  try {
    const deleted = await deleteReminder(req.params.id);
    res.json({ success: true, data: deleted });
  } catch (err) {
    console.error("❌ Error deleting reminder:", err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting reminder" });
  }
};

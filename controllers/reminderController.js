import {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
} from "../models/Reminder.js";

// import { createReminder } from "../models/Reminder.js";
import { getUserById } from "../models/Users.js";
import { getPrescriptionById } from "../models/Prescription.js"; // Create this
import { getFamilyMemberById } from "../models/Family.js"; // Create this
import { scheduleReminderEmail } from "../utils/sendEmail.js";

export const addReminder = async (req, res) => {
  try {
    const { family_member_id, prescription_id, reminder_time, note } = req.body;
    const user_id = req.user.id;

    // ✅ 1️⃣ Create reminder in DB
    const reminder = await createReminder({
      user_id,
      family_member_id,
      prescription_id,
      reminder_time,
      note,
    });

    // ✅ 2️⃣ Fetch related data
    const user = await getUserById(user_id);
    const prescription = await getPrescriptionById(prescription_id);
    const familyMember = await getFamilyMemberById(family_member_id);

    // ✅ 3️⃣ Get medicine name correctly (column check)
    // Adjust field if your DB column is "medicine" or "name"
    const medicineName =
      prescription?.medicine_name ||
      prescription?.medicine ||
      prescription?.name ||
      "Unknown Medicine";

    const familyMemberName = familyMember?.name || "";

    // ✅ 4️⃣ Schedule the email
    const emailScheduled = await scheduleReminderEmail(
      user.email,
      medicineName,
      familyMemberName,
      reminder_time,
      note
    );

    res.status(201).json({
      success: true,
      message: "✅ Reminder added successfully and email scheduled.",
      emailScheduled,
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

// ✅ Get all reminders for logged-in user
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

// ✅ Get single reminder
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

// ✅ Update reminder
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

// ✅ Delete reminder
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

// ✅ Get all reminders for user
// export const getAllReminders = async (user_id) => {
//   try {
//     const result = await query(
//       `SELECT
//          r.*,
//          f.name AS family_member_name,
//          p.medicine_name AS medicine_name
//        FROM reminders r
//        LEFT JOIN family_members f ON r.family_member_id = f.id
//        LEFT JOIN prescriptions p ON r.prescription_id = p.id
//        WHERE r.user_id = $1
//        ORDER BY r.reminder_time ASC`,
//       [user_id]
//     );

//     console.log("✅ Reminders fetched from DB:", result.rows);
//     return result.rows;
//   } catch (err) {
//     console.error("❌ Error in getAllReminders:", err.message);
//     throw err;
//   }
// };

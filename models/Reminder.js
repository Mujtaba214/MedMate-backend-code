import query from "../db/db.js";

// ✅ Create Reminder
export const createReminder = async (data) => {
  const { user_id, family_member_id, prescription_id, reminder_time } = data;
  const result = await query(
    `INSERT INTO reminders (user_id, family_member_id, prescription_id, reminder_time)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, family_member_id, prescription_id, reminder_time]
  );
  return result.rows[0];
};

// ✅ Get all reminders for user
export const getAllReminders = async (user_id) => {
  const result = await query(
    `SELECT r.*, f.name AS family_member_name, p.medicine
     FROM reminders r
     LEFT JOIN family_members f ON r.family_member_id = f.id
     LEFT JOIN prescriptions p ON r.prescription_id = p.id
     WHERE r.user_id = $1
     ORDER BY r.reminder_time ASC`,
    [user_id]
  );
  return result.rows;
};

// ✅ Get single reminder by ID
export const getReminderById = async (id) => {
  const result = await query("SELECT * FROM reminders WHERE id = $1", [id]);
  return result.rows[0];
};

// ✅ Update reminder
export const updateReminder = async (id, data) => {
  const { reminder_time } = data;
  const result = await query(
    `UPDATE reminders SET reminder_time = $1 WHERE id = $2 RETURNING *`,
    [reminder_time, id]
  );
  return result.rows[0];
};

// ✅ Delete reminder
export const deleteReminder = async (id) => {
  const result = await query(
    "DELETE FROM reminders WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
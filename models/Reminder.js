import query from "../db/db.js";

export const createReminder = async (data) => {
  const {
    user_id,
    family_member_id,
    prescription_id,
    reminder_time,
    note,
    repeat_type,
    repeat_days,
  } = data;

  const result = await query(
    `INSERT INTO reminders 
    (user_id, family_member_id, prescription_id, reminder_time, note, repeat_type, repeat_days)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      user_id,
      family_member_id,
      prescription_id,
      reminder_time,
      note,
      repeat_type,
      repeat_days,
    ]
  );
  return result.rows[0];
};

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

export const getReminderById = async (id) => {
  const result = await query("SELECT * FROM reminders WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateReminder = async (id, data) => {
  const { reminder_time, note, repeat_type, repeat_days } = data;

  const result = await query(
    `UPDATE reminders
     SET reminder_time = $1, note = $2, repeat_type = $3, repeat_days = $4
     WHERE id = $5
     RETURNING *`,
    [reminder_time, note, repeat_type, repeat_days, id]
  );
  return result.rows[0];
};

export const deleteReminder = async (id) => {
  const result = await query(
    "DELETE FROM reminders WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

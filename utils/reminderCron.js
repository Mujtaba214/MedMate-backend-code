import cron from "node-cron";
import query from "../db/db.js";
import sendEmail from "./sendEmail.js";

cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Checking pending reminders...");

  const now = new Date();

  try {
    const result = await query(
      `
      SELECT r.*, 
             u.email AS user_email, 
             p.medicine AS medicine_name, 
             f.name AS family_member_name
      FROM reminders r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN prescriptions p ON r.prescription_id = p.id
      LEFT JOIN family_members f ON r.family_member_id = f.id
      WHERE r.reminder_time <= $1 
        AND r.email_sent = false
      `,
      [now]
    );

    if (result.rows.length === 0) {
      console.log("✅ No reminders to send right now.");
      return;
    }

    for (const reminder of result.rows) {
      const { id, user_email, medicine_name, family_member_name, reminder_time } = reminder;

      const readableTime = new Date(reminder_time).toLocaleString();

      const subject = `💊 Reminder: ${medicine_name}`;
      const message = `
Dear ${family_member_name || "User"},

This is a reminder to take your medicine: **${medicine_name}**.

🕒 Scheduled Time: ${readableTime}

Stay consistent with your health routine.
– MedMate Team
      `;

      await sendEmail({
        to: user_email,
        subject,
        text: message,
      });

      await query("UPDATE reminders SET email_sent = true WHERE id = $1", [id]);
      console.log(`📨 Reminder email sent to ${user_email} for ${medicine_name}`);
    }
  } catch (err) {
    console.error("❌ Error in reminder cron:", err);
  }
});

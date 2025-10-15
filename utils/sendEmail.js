import nodemailer from "nodemailer";
import schedule from "node-schedule";

// ✅ Configure transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Schedule a reminder email to be sent at a specific time.
 * @param {string} to - Recipient email
 * @param {string} medicineName - Name of the medicine
 * @param {string} familyMemberName - Name of the family member
 * @param {Date|string} reminderTime - When the email should be sent
 * @param {string} note - Optional note for the reminder
 * @returns {Promise<boolean>}
 */
export const scheduleReminderEmail = async (to, medicineName, familyMemberName, reminderTime, note = "") => {
  try {
    const sendTime = new Date(reminderTime);

    if (sendTime < new Date()) {
      console.warn("⚠️ Reminder time is in the past, sending immediately");
    }

    schedule.scheduleJob(sendTime, async () => {
      const subject = "🩺 Medicine Reminder";
      const messageLines = [
        `Hello${familyMemberName ? `, ${familyMemberName}` : ""}!`,
        "",
        `This is a friendly reminder to take your medicine: ${medicineName || "General Medicine"}.`,
      ];
      if (note) messageLines.push(`Note: ${note}`);
      messageLines.push("", "Stay healthy! 💊");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: messageLines.join("\n"),
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Reminder email sent to ${to} for ${medicineName}`);
      } catch (err) {
        console.error("❌ Error sending scheduled email:", err);
      }
    });

    console.log(`⏰ Email scheduled for ${sendTime.toLocaleString()} to ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Error scheduling email:", err);
    return false;
  }
};

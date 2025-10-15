// models/User.js
import query from "../db/db.js";

// Get user by ID
export const getUserById = async (id) => {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("❌ getUserById error:", err.message);
    throw err;
  }
};

// Update user by ID
export const updateUserById = async (id, data) => {
  const { name, email, phone, date_of_birth, gender } = data;
  try {
    const result = await query(
      `UPDATE users 
       SET name = $1, email = $2, phone = $3, date_of_birth = $4, gender = $5
       WHERE id = $6
       RETURNING *`,
      [name, email, phone, date_of_birth, gender, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ updateUserById error:", err.message);
    throw err;
  }
};

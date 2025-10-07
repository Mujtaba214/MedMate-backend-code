import { query } from "../db/db.js";

export const createFamilyMember = async (
  userId,
  { name, relation, dob, gender }
) => {
  const result = await query(
    `INSERT INTO family_members (user_id, name, relation, dob, gender)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, name, relation, dob, gender]
  );
  return result.rows[0];
};

export const getFamilyMembersByUser = async (userId) => {
  const result = await query(
    `SELECT * FROM family_members WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

export const updateFamilyMember = async (
  id,
  userId,
  { name, relation, dob, gender }
) => {
  const result = await query(
    `UPDATE family_members SET name=$1, relation=$2, dob=$3, gender=$4 
     WHERE id=$5 AND user_id=$6 RETURNING *`,
    [name, relation, dob, gender, id, userId]
  );
  return result.rows[0];
};

export const deleteFamilyMember = async (id, userId) => {
  await query(`DELETE FROM family_members WHERE id=$1 AND user_id=$2`, [
    id,
    userId,
  ]);
};

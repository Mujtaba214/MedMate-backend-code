import query from "../db/db.js";

export const createPrescription = async ({
  userId,
  familyId,
  medicine,
  dosage,
  duration,
  doctor,
  image_url, 
}) => {
  const result = await query(
    `INSERT INTO prescriptions 
   (user_id, family_id, medicine, dosage, duration, doctor, image_url)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING *`,
    [userId, familyId, medicine, dosage, duration, doctor, image_url]
  );

  return result.rows[0];
};

export const getPrescriptionsByFamily = async (familyId, userId) => {
  const result = await query(
    `SELECT p.*
     FROM prescriptions p
     JOIN family_members f ON p.family_id = f.id
     WHERE f.id = $1 AND f.user_id = $2
     ORDER BY p.id DESC`,
    [familyId, userId]
  );
  return result.rows;
};

export const getPrescriptionById = async (id) => {
  const result = await query("SELECT * FROM prescriptions WHERE id = $1", [id]);
  return result.rows[0];
};


export const getAllPrescriptionsByUser = async (userId) => {
  const result = await query(
    `SELECT p.*
     FROM prescriptions p
     LEFT JOIN family_members f ON p.family_id = f.id
     WHERE p.user_id = $1 OR f.user_id = $1
     ORDER BY p.id DESC`,
    [userId]
  );
  return result.rows;
};

export const updatePrescription = async (
  id,
  userId,
  { medicine, dosage, duration, doctor, imageUrl }
) => {
  const result = await query(
    `UPDATE prescriptions 
     SET medicine=$1, dosage=$2, duration=$3, doctor=$4, image_url=$5
     WHERE id=$6 AND family_id IN (SELECT id FROM family_members WHERE user_id=$7)
     RETURNING *`,
    [medicine, dosage, duration, doctor, imageUrl, id, userId]
  );
  return result.rows[0];
};

export const deletePrescription = async (id, userId) => {
  await query(
    `DELETE FROM prescriptions 
     WHERE id=$1 AND family_id IN (SELECT id FROM family_members WHERE user_id=$2)`,
    [id, userId]
  );
};
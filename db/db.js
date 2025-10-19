import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});


db.connect();

db.on("error", (err) => {
   console.error("Unexpected error while connecting db", err);
  process.exit(-1);
});

const query = (text, params) => db.query(text, params);
export default query;
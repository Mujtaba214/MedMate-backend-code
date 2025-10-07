import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import { fileURLToPath } from "url";
import path from "path";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use("/api", authRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

app.listen(process.env.PORT, () => {
  console.log("server running");
});

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import router from "./Routes/authRoutes";
import shopRouter from "./Routes/shopRoutes";
import dotenv from "dotenv";

dotenv.config(); // 🔹 Load environment variables from .env

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI; // 🔹 Get MongoDB URI from .env

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing! Add it to your .env file.");
  process.exit(1); // Stop server if MONGO_URI is missing
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Connected");
});

app.use("/auth", router);
app.use("/shops", shopRouter);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes"

dotenv.config();
connectDB();

const app = express();

// app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})
app.get("/test", (req, res) => {
  res.json({ message: "works" })
})
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
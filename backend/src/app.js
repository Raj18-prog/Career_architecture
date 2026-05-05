import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import careerRoutes from "./routes/career.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "career-architect" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/career", careerRoutes);

// Central error handler keeps controller code focused on happy-path logic.
app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.statusCode || 500;
  res.status(status).json({
    message: error.message || "Something went wrong"
  });
});

export default app;

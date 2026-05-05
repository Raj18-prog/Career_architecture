import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import careerRoutes from "./routes/career.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

const app = express();

const normalizeOrigin = (origin) => origin.replace(/\/$/, "");

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    ...(process.env.CLIENT_URLS || "").split(","),
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]
    .filter(Boolean)
    .map((origin) => origin.trim())
    .map(normalizeOrigin)
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const requestOrigin = normalizeOrigin(origin);

    if (allowedOrigins.has(requestOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
  const status = error.message?.includes("not allowed by CORS")
    ? 403
    : error.statusCode || 500;

  res.status(status).json({
    message: error.message || "Something went wrong"
  });
});

export default app;

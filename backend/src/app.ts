
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";
import documentRoutes from "./routes/document.routes";
import chatRoutes from "./routes/chat.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.status(200).send("Welcome to Zuno API 🚀");
});

// Health check route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Zuno backend is running!",
  });
});

app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
export default app;

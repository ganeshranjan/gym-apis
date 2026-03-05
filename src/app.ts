import express from "express";
import baseRoutes from "./routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Return 400 for invalid JSON instead of letting the error propagate
app.use(
  (
    err: Error & { status?: number; type?: string },
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.status === 400 && err.type === "entity.parse.failed") {
      return res.status(400).json({
        message: "Invalid JSON in request body",
        detail: err.message,
      });
    }
    next(err);
  }
);

app.use("/api", baseRoutes);

app.get("/", (req, res) => {
  res.send("GymSym API running 🚀");
});

export default app;

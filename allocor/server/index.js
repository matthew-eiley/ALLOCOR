import express from "express";
import userResetRouter from "./routes/passwordReset.js";
import registerRouter from "./routes/register.js";
import cors from "cors";

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use("/api/user", userResetRouter);
app.use("/api", registerRouter);

export default app;

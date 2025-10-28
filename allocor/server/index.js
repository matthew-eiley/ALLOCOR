import express from "express";
import userResetRouter from "./routes/passwordReset.js";

const app = express();
app.use(express.json());

app.use("/api/user", userResetRouter);

export default app;

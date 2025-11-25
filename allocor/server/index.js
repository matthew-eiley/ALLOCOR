import express from "express";
import cors from "cors";
import accountsRouter from "./routes/accounts.js";
import portfoliosRouter from "./routes/portfolios.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/accounts", accountsRouter);
app.use("/api/portfolios", portfoliosRouter);

app.get("/__health", (req, res) => res.json({ status: "ok" }));

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export default app;

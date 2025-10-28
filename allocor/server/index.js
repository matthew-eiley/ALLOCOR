import express from 'express';
import accountsRouter from './routes/accounts.js';
import deleteAccountRoute from "./routes/deleteAccount.js";

const app = express();
app.use(express.json());

app.use('/api/accounts', accountsRouter);

app.use("/api/account/delete", deleteAccountRoute);

app.get('/__health', (req, res) => res.json({ status: 'ok' }));


if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export default app;

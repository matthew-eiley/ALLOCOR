import request from "supertest";
import express from "express";
import deleteAccountRoute from "../server/routes/deleteAccount.js";

const app = express();
app.use(express.json());
app.use("/api/account/delete", deleteAccountRoute);

describe("DELETE /api/account/delete", () => {
  it("returns 200 and success message when deleting account", async () => {
    const res = await request(app)
      .delete("/api/account/delete")
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Account deletion simulated successfully (no persistence)."
    );
  });

  it("returns 404 for non-DELETE methods", async () => {
    const res = await request(app)
      .get("/api/account/delete")
      .send();

    expect(res.status).toBe(404);
  });
});


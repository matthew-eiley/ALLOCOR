import request from "supertest";
import app from "../server/index.js";
import { describe, it, expect } from "vitest";

describe("PATCH /api/user/reset-password", () => {
  it("successfully changes password when newPassword is valid", async () => {
    const res = await request(app).patch("/api/user/reset-password").send({
      newPassword: "verysecurepassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Password Changed");
  });

  it("returns 400 when newPassword is missing", async () => {
    const res = await request(app).patch("/api/user/reset-password").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "New password required");
  });

  it("returns 400 when newPassword is too short", async () => {
    const res = await request(app).patch("/api/user/reset-password").send({
      newPassword: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "New Password is Too Short");
  });

  it("returns 403 with message 'Not Authorized' when simulated", async () => {
    const res = await request(app).patch("/api/user/reset-password").send({
      newPassword: "verysecurepassword",
      simulateWrong: true,
    });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Not Authorized");
  });
});

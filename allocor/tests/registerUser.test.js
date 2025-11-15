import request from "supertest";
import app from "../server/index.js";
import { describe, it, expect, beforeEach } from "vitest";

describe("POST /api/register", () => {
  const validUser = {
    username: "testuser",
    email: "test@example.com",
    password: "TestPass123"
  };

  it("successfully registers a user with valid data", async () => {
    const res = await request(app)
      .post("/api/register")
      .send(validUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body.user).toHaveProperty("username", validUser.username);
    expect(res.body.user).toHaveProperty("email", validUser.email);
    expect(res.body.user).toHaveProperty("id");
  });

  it("prevents registration with duplicate email", async () => {
    // First registration
    await request(app)
      .post("/api/register")
      .send(validUser);

    // Attempt to register with same email
    const res = await request(app)
      .post("/api/register")
      .send({
        ...validUser,
        username: "differentuser"
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error", "Email already exists");
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "All fields are required");
    expect(res.body.errors).toHaveProperty("username", "Username is required");
    expect(res.body.errors).toHaveProperty("email", "Email is required");
    expect(res.body.errors).toHaveProperty("password", "Password is required");
  });

  it("returns 400 when email format is invalid", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        ...validUser,
        email: "invalidemail"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid email format");
    expect(res.body.errors).toHaveProperty("email", "Email is invalid");
  });

  it("returns 400 when password is too short", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        ...validUser,
        password: "short"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid password");
    expect(res.body.errors.password).toContain("Password must be 8 to 15 characters long");
  });

  it("returns 400 when password lacks uppercase letters", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        ...validUser,
        password: "testpass123"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid password");
    expect(res.body.errors.password).toContain("Password must contain both lowercase and uppercase letters");
  });

  it("returns 400 when password lacks numbers", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        ...validUser,
        password: "TestNoNumber"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid password");
    expect(res.body.errors.password).toContain("Password must contain at least one number");
  });

  describe("GET /api/account/:email", () => {
    it("returns 200 and exists=true when email exists", async () => {
      // First register a user
      await request(app)
        .post("/api/register")
        .send(validUser);

      // Then check if email exists
      const res = await request(app)
        .get(`/api/account/${validUser.email}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("exists", true);
    });

    it("returns 404 and exists=false when email doesn't exist", async () => {
      const res = await request(app)
        .get("/api/account/nonexistent@example.com");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("exists", false);
    });
  });
});
import express from "express";

const router = express.Router();

// In-memory store for users
const users = new Map();

router.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({
            error: "All fields are required",
            errors: {
                username: !username ? "Username is required" : "",
                email: !email ? "Email is required" : "",
                password: !password ? "Password is required" : ""
            }
        });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({
            error: "Invalid email format",
            errors: {
                email: "Email is invalid"
            }
        });
    }

    // Validate password (8-15 chars, mixed case, number)
    if (password.length < 8 || password.length > 15) {
        return res.status(400).json({
            error: "Invalid password",
            errors: {
                password: "Password must be 8 to 15 characters long"
            }
        });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
        return res.status(400).json({
            error: "Invalid password",
            errors: {
                password: "Password must contain both lowercase and uppercase letters"
            }
        });
    }
    if (!/\d/.test(password)) {
        return res.status(400).json({
            error: "Invalid password",
            errors: {
                password: "Password must contain at least one number"
            }
        });
    }

    // Check if email already exists
    if (Array.from(users.values()).some(user => user.email === email)) {
        return res.status(409).json({
            error: "Email already exists",
            message: "Email already exists"
        });
    }

    // Store new user
    const userId = Date.now().toString();
    users.set(userId, {
        id: userId,
        username,
        email,
        password // Note: In a real app, this should be hashed
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: userId,
            username,
            email
        }
    });
});

// Route to check if email exists (used by frontend validation)
router.get("/account/:email", (req, res) => {
    const { email } = req.params;
    const userExists = Array.from(users.values()).some(user => user.email === email);
    
    if (userExists) {
        res.status(200).json({ exists: true });
    } else {
        res.status(404).json({ exists: false });
    }
});

export default router;
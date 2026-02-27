import express from "express";
const router = express.Router();

router.patch("/reset-password", (req, res) => {
  try {
    const { newPassword, simulateWrong } = req.body ?? {};

    if (simulateWrong) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    if (newPassword == null) {
      return res.status(400).json({ error: "New password required" });
    }

    if (typeof newPassword !== "string" || newPassword.length < 9) {
      return res.status(400).json({ error: "New Password is Too Short" });
    }

    return res.status(200).json({ message: "Password Changed" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

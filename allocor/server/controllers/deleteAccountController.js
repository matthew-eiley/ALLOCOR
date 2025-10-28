// allocor/server/controllers/deleteAccountController.js
// Mock Delete Account controller (no database persistence)

export const deleteAccount = (req, res) => {
  console.log("Simulating account deletion...");
  return res.status(200).json({
    message: "Account deletion simulated successfully (no persistence).",
  });
};

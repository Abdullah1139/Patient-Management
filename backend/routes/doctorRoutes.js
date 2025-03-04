const express = require("express");
const { getDoctors, getAvailability, updateAvailability } = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Doctor Routes
router.get("/doctors", getDoctors);
router.get("/doctors/:id/availability", getAvailability);
router.put("/doctors/:id/availability", authMiddleware, updateAvailability); // Admin-only route

module.exports = router;
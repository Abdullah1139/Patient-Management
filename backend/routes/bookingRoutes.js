const express = require("express");
const { bookAppointment, cancelAppointment, getUserBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Booking Routes
router.post("/book", authMiddleware, bookAppointment);
router.delete("/cancel/:id", authMiddleware, cancelAppointment);
router.get("/bookings", authMiddleware, getUserBookings);

module.exports = router;
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const doctor = await Doctor.findById(doctorId);

    // Check if slot is available
    if (!doctor.availableSlots.includes(time)) {
      throw new Error("Slot not available");
    }

    // Book the slot
    const appointment = new Appointment({ userId: req.userId, doctorId, date, time });
    await appointment.save();

    // Update doctor's slots
    doctor.availableSlots = doctor.availableSlots.filter((slot) => slot !== time);
    doctor.bookedSlots.push(time);
    await doctor.save();

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    const doctor = await Doctor.findById(appointment.doctorId);

    // Free the slot
    doctor.bookedSlots = doctor.bookedSlots.filter((slot) => slot !== appointment.time);
    doctor.availableSlots.push(appointment.time);
    await doctor.save();

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Appointment.find({ userId: req.userId }).populate("doctorId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
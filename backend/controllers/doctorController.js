const Doctor = require("../models/Doctor");

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctor availability
exports.getAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.status(200).json({ availableSlots: doctor.availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update doctor availability (Admin-only)
exports.updateAvailability = async (req, res) => {
  try {
    const { availableSlots } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { availableSlots }, { new: true });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  serviceId: { type: String, default: "" },
  serviceName: { type: String, default: "" },
  duration: { type: Number, default: 60 },
  price: { type: Number, default: 0 },
  preferredDate: { type: String, default: "" },
  timeSlot: { type: String, default: "" },
  therapistPreference: { type: String, default: "Any" },
  address: { type: String, required: true },
  landmark: { type: String, default: "" },
  specialNotes: { type: String, default: "" },
  language: { type: String, default: "en" },
  status: { type: String, default: "CONFIRMED_PENDING_WHATSAPP" }
}, {
  timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);

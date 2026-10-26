const mongoose = require("mongoose");

const durationSchema = new mongoose.Schema({
  minutes: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name_en: { type: String, required: true },
  name_ta: { type: String, required: true },
  tagline_en: { type: String, default: "" },
  tagline_ta: { type: String, default: "" },
  description_en: { type: String, default: "" },
  description_ta: { type: String, default: "" },
  category_en: { type: String, default: "Wellness" },
  category_ta: { type: String, default: "நல்வாழ்வு" },
  durations: [durationSchema],
  oils_en: { type: String, default: "" },
  oils_ta: { type: String, default: "" },
  therapist_available: { type: [String], default: ["Male", "Female"] },
  icon: { type: String, default: "fa-solid fa-spa" },
  popular: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model("Service", serviceSchema);

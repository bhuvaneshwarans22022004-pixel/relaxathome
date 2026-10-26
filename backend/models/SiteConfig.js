const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  areas: { type: String, default: "" }
}, { _id: false });

const siteConfigSchema = new mongoose.Schema({
  key: { type: String, default: "main_config", unique: true },
  companyName: { type: String, default: "RelaxAtHome Doorstep Massage & Spa" },
  companyNameTa: { type: String, default: "ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் & ஸ்பா" },
  whatsappPhone: { type: String, default: "919876543210" },
  phoneDisplay: { type: String, default: "+91 98765 43210" },
  supportEmail: { type: String, default: "booking@relaxathome.in" },
  operatingHours: { type: String, default: "8:00 AM - 10:00 PM (All 7 Days)" },
  operatingHoursTa: { type: String, default: "காலை 8:00 - இரவு 10:00 (7 நாட்களும்)" },
  serviceCities: { type: String, default: "Chennai, Coimbatore, Madurai, Trichy, Bangalore" },
  serviceCitiesTa: { type: String, default: "சென்னை, கோயம்புத்தூர், மதுரை, திருச்சி, பெங்களூர்" },
  locations: [locationSchema],
  footerAboutEn: { type: String, default: "" },
  footerAboutTa: { type: String, default: "" }
}, {
  timestamps: true
});

module.exports = mongoose.model("SiteConfig", siteConfigSchema);

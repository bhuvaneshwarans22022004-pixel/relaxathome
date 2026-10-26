const mongoose = require("mongoose");
const Service = require("../models/Service");
const SiteConfig = require("../models/SiteConfig");
const { services: defaultServices } = require("../data/servicesData");

const defaultConfig = {
  key: "main_config",
  companyName: process.env.COMPANY_NAME || "RelaxAtHome Doorstep Massage & Spa",
  companyNameTa: process.env.COMPANY_NAME_TA || "ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் & ஸ்பா",
  whatsappPhone: process.env.WHATSAPP_PHONE || "919876543210",
  phoneDisplay: "+91 98765 43210",
  supportEmail: process.env.SUPPORT_EMAIL || "booking@relaxathome.in",
  operatingHours: process.env.OPERATING_HOURS || "8:00 AM - 10:00 PM (All 7 Days)",
  operatingHoursTa: process.env.OPERATING_HOURS_TA || "காலை 8:00 - இரவு 10:00 (7 நாட்களும்)",
  serviceCities: process.env.SERVICE_CITIES || "Chennai, Coimbatore, Madurai, Trichy, Bangalore",
  serviceCitiesTa: process.env.SERVICE_CITIES_TA || "சென்னை, கோயம்புத்தூர், மதுரை, திருச்சி, பெங்களூர்",
  locations: [
    { city: "Chennai", areas: "Adyar, OMR, Anna Nagar, Velachery" },
    { city: "Coimbatore", areas: "RS Puram, Peelamedu, Gandhipuram" },
    { city: "Madurai", areas: "KK Nagar, Anna Nagar, Bypass" },
    { city: "Trichy", areas: "Thillai Nagar, Cantonment" },
    { city: "Bangalore", areas: "Koramangala, Indiranagar, HSR" }
  ],
  footerAboutEn: "South India's most trusted certified doorstep massage service centre. We bring 5-star spa relaxation, sanitized portable beds, and herbal aromatherapy right to your living room or hotel room.",
  footerAboutTa: "தென்னிந்தியாவின் நம்பகமான இல்ல மசாஜ் சேவை மையம். 5-நட்சத்திர ஸ்பா வசதிகள், சுத்திகரிக்கப்பட்ட மசாஜ் படுக்கை மற்றும் இயற்கை எண்ணெய்களுடன் உங்கள் இல்லத்திற்கே வருகிறோம்."
};

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("[MongoDB] Warning: MONGODB_URI not defined in .env. Skipping MongoDB connection.");
    return false;
  }

  try {
    console.log("[MongoDB] Connecting to MongoDB Atlas...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log("======================================================");
    console.log("  MongoDB Atlas Connected Successfully! ✅");
    console.log("======================================================");

    // Auto-seed if collections are empty
    await seedInitialData();
    return true;
  } catch (err) {
    console.error("[MongoDB] Connection Error:", err.message);
    console.warn("[MongoDB] Falling back to local cache mode if connection fails.");
    return false;
  }
}

async function seedInitialData() {
  try {
    // 1. Seed Config if missing
    const existingConfig = await SiteConfig.findOne({ key: "main_config" });
    if (!existingConfig) {
      await SiteConfig.create(defaultConfig);
      console.log("[MongoDB] Seeded default SiteConfig into MongoDB Atlas.");
    }

    // 2. Seed Services if missing
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(defaultServices);
      console.log(`[MongoDB] Seeded ${defaultServices.length} default massage services into MongoDB Atlas.`);
    }
  } catch (err) {
    console.error("[MongoDB] Error seeding initial data:", err.message);
  }
}

module.exports = {
  connectDB,
  defaultConfig
};

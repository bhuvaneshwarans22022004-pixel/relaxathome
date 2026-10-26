require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const storeManager = require("./data/storeManager");
const { testimonials } = require("./data/servicesData");
const { generateWhatsAppBookingUrl, generateQuickWhatsAppInquiryUrl } = require("./utils/whatsappHelper");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 1. Health check & DB Status
app.get("/api/health", async (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "healthy",
    service: "RelaxAtHome Backend API (MongoDB Atlas)",
    database: {
      type: "MongoDB Atlas",
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// 2. Config & public dynamic site information
app.get("/api/config", async (req, res) => {
  try {
    const cfg = await storeManager.getConfig();
    res.json({
      ...cfg,
      defaultQuickWhatsAppUrl: generateQuickWhatsAppInquiryUrl({ whatsappPhone: cfg.whatsappPhone, language: "en" }),
      defaultQuickWhatsAppUrlTa: generateQuickWhatsAppInquiryUrl({ whatsappPhone: cfg.whatsappPhone, language: "ta" })
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve configuration", details: err.message });
  }
});

// 3. Admin: Update Site & Footer Configuration
app.put("/api/admin/config", async (req, res) => {
  try {
    const updated = await storeManager.updateConfig(req.body);
    res.json({
      success: true,
      message: "Site configuration updated in MongoDB Atlas successfully",
      config: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update configuration", details: err.message });
  }
});

// 4. Get all services (Dynamic from MongoDB)
app.get("/api/services", async (req, res) => {
  try {
    const services = await storeManager.getServices();
    res.json({
      count: services.length,
      services: services
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve services", details: err.message });
  }
});

// 5. Get specific service
app.get("/api/services/:id", async (req, res) => {
  try {
    const service = await storeManager.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve service", details: err.message });
  }
});

// 6. Admin: Add New Service Card
app.post("/api/admin/services", async (req, res) => {
  try {
    const newService = await storeManager.addService(req.body);
    res.status(201).json({
      success: true,
      message: "New service card added to MongoDB Atlas successfully",
      service: newService
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add service", details: err.message });
  }
});

// 7. Admin: Update Existing Service Card
app.put("/api/admin/services/:id", async (req, res) => {
  try {
    const updated = await storeManager.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Service not found to update" });
    }
    res.json({
      success: true,
      message: "Service card updated in MongoDB Atlas successfully",
      service: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update service", details: err.message });
  }
});

// 8. Admin: Delete Service Card
app.delete("/api/admin/services/:id", async (req, res) => {
  try {
    const ok = await storeManager.deleteService(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: "Service not found to delete" });
    }
    res.json({
      success: true,
      message: "Service card deleted from MongoDB Atlas successfully"
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service", details: err.message });
  }
});

// 9. Admin: Reset to default services and configuration
app.post("/api/admin/reset", async (req, res) => {
  try {
    const resetData = await storeManager.resetToDefaults();
    res.json({
      success: true,
      message: "Database reset to defaults in MongoDB Atlas successfully",
      config: resetData.config,
      servicesCount: resetData.services.length
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset data", details: err.message });
  }
});

// 10. Get testimonials
app.get("/api/testimonials", (req, res) => {
  res.json(testimonials);
});

// 11. Submit a Doorstep Booking & Generate WhatsApp Link
app.post("/api/bookings", async (req, res) => {
  try {
    const cfg = await storeManager.getConfig();
    const {
      customerName,
      customerPhone,
      serviceId,
      duration = 60,
      preferredDate,
      timeSlot,
      therapistPreference = "Any",
      address,
      landmark = "",
      specialNotes = "",
      language = "en"
    } = req.body;

    if (!customerName || !customerPhone || !address) {
      return res.status(400).json({
        error: "Missing required fields: customerName, customerPhone, and address are required"
      });
    }

    const services = await storeManager.getServices();
    const selectedService = services.find(s => s.id === serviceId) || services[0];
    const durationOption = selectedService.durations.find(d => d.minutes === Number(duration)) || selectedService.durations[0];
    const serviceName = language === "ta" ? selectedService.name_ta : selectedService.name_en;

    const bookingId = `RAH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = {
      bookingId,
      customerName,
      customerPhone,
      serviceId: selectedService.id,
      serviceName,
      duration: durationOption.minutes,
      price: durationOption.price,
      preferredDate: preferredDate || new Date().toISOString().split("T")[0],
      timeSlot: timeSlot || "Flexible / அடுத்த 1 மணி நேரம்",
      therapistPreference,
      address,
      landmark,
      specialNotes,
      language,
      status: "CONFIRMED_PENDING_WHATSAPP"
    };

    await storeManager.addBooking(newBooking);

    // Generate WhatsApp direct deep link
    const whatsappUrl = generateWhatsAppBookingUrl({
      whatsappPhone: cfg.whatsappPhone,
      language,
      bookingId,
      customerName,
      customerPhone,
      serviceName,
      duration: durationOption.minutes,
      price: durationOption.price,
      preferredDate: newBooking.preferredDate,
      timeSlot: newBooking.timeSlot,
      therapistPreference,
      address,
      landmark,
      specialNotes
    });

    res.status(201).json({
      success: true,
      message: language === "ta"
        ? "உங்கள் முன்பதிவு தயார்! உடனடியாக வாட்ஸ்அப்பில் உறுதிப்படுத்தவும்."
        : "Booking registered! Confirm directly with our team on WhatsApp.",
      booking: newBooking,
      whatsappUrl
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Failed to process booking", details: err.message });
  }
});

// 12. List bookings (for Admin)
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const list = await storeManager.getBookings();
    res.json({
      total: list.length,
      bookings: list
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve bookings", details: err.message });
  }
});

// Start Server and Connect to MongoDB
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(`  RelaxAtHome Node.js Backend is running on port ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Database: MongoDB Atlas (${process.env.MONGODB_URI ? 'Configured' : 'Missing'})`);
    console.log(`  API Health: http://localhost:${PORT}/api/health`);
    console.log(`======================================================`);
  });
}

startServer();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Service = require("../models/Service");
const SiteConfig = require("../models/SiteConfig");
const Booking = require("../models/Booking");
const { services: defaultServices } = require("./servicesData");
const { defaultConfig } = require("../config/db");

const STORE_PATH = path.join(__dirname, "store.json");

let localStore = {
  config: { ...defaultConfig },
  services: [...defaultServices],
  bookings: []
};

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Local cache fallback helpers
function loadLocalStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      localStore = {
        config: { ...defaultConfig, ...(parsed.config || {}) },
        services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : [...defaultServices],
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : []
      };
    } else {
      saveLocalStore();
    }
  } catch (err) {
    console.error("[Store] Error loading local store:", err);
  }
}

function saveLocalStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(localStore, null, 2), "utf-8");
  } catch (err) {
    console.error("[Store] Error saving local store:", err);
  }
}

// --- CONFIG OPERATIONS ---
async function getConfig() {
  if (isMongoConnected()) {
    try {
      const doc = await SiteConfig.findOne({ key: "main_config" }).lean();
      if (doc) {
        delete doc._id;
        delete doc.__v;
        localStore.config = doc;
        saveLocalStore();
        return doc;
      }
    } catch (err) {
      console.warn("[Store] MongoDB getConfig failed, using local cache:", err.message);
    }
  }
  return localStore.config;
}

async function updateConfig(newConfig) {
  if (isMongoConnected()) {
    try {
      const updated = await SiteConfig.findOneAndUpdate(
        { key: "main_config" },
        { $set: newConfig },
        { new: true, upsert: true }
      ).lean();
      delete updated._id;
      delete updated.__v;
      localStore.config = updated;
      saveLocalStore();
      return updated;
    } catch (err) {
      console.warn("[Store] MongoDB updateConfig failed, using local cache:", err.message);
    }
  }
  localStore.config = { ...localStore.config, ...newConfig };
  saveLocalStore();
  return localStore.config;
}

// --- SERVICE CARDS OPERATIONS ---
async function getServices() {
  if (isMongoConnected()) {
    try {
      const list = await Service.find().sort({ createdAt: 1 }).lean();
      if (list && list.length > 0) {
        const cleaned = list.map(item => {
          const { _id, __v, ...rest } = item;
          return rest;
        });
        localStore.services = cleaned;
        saveLocalStore();
        return cleaned;
      }
    } catch (err) {
      console.warn("[Store] MongoDB getServices failed, using local cache:", err.message);
    }
  }
  return localStore.services;
}

async function getServiceById(id) {
  if (isMongoConnected()) {
    try {
      const doc = await Service.findOne({ id }).lean();
      if (doc) {
        const { _id, __v, ...rest } = doc;
        return rest;
      }
    } catch (err) {
      console.warn("[Store] MongoDB getServiceById failed:", err.message);
    }
  }
  return localStore.services.find(s => s.id === id);
}

async function addService(serviceData) {
  const id = serviceData.id || `service-${Date.now()}`;
  const newService = {
    id,
    name_en: serviceData.name_en || "Custom Massage Therapy",
    name_ta: serviceData.name_ta || "சிறப்பு மசாஜ் சிகிச்சை",
    tagline_en: serviceData.tagline_en || "Professional doorstep relaxation",
    tagline_ta: serviceData.tagline_ta || "தொழில்முறை இல்ல மசாஜ்",
    description_en: serviceData.description_en || "",
    description_ta: serviceData.description_ta || "",
    category_en: serviceData.category_en || "Wellness",
    category_ta: serviceData.category_ta || "நல்வாழ்வு",
    durations: serviceData.durations && serviceData.durations.length > 0
      ? serviceData.durations
      : [
          { minutes: 60, price: 1799, originalPrice: 2299 },
          { minutes: 90, price: 2399, originalPrice: 2999 },
          { minutes: 120, price: 3099, originalPrice: 3899 }
        ],
    oils_en: serviceData.oils_en || "Pure Essential Herbal Oil",
    oils_ta: serviceData.oils_ta || "இயற்கை மூலிகை எண்ணெய்",
    therapist_available: serviceData.therapist_available || ["Male", "Female"],
    icon: serviceData.icon || "fa-solid fa-spa",
    popular: Boolean(serviceData.popular)
  };

  if (isMongoConnected()) {
    try {
      await Service.create(newService);
    } catch (err) {
      console.warn("[Store] MongoDB addService failed:", err.message);
    }
  }

  localStore.services.push(newService);
  saveLocalStore();
  return newService;
}

async function updateService(id, updatedData) {
  let updatedDoc = null;

  if (isMongoConnected()) {
    try {
      const doc = await Service.findOneAndUpdate(
        { id },
        { $set: updatedData },
        { new: true }
      ).lean();
      if (doc) {
        const { _id, __v, ...rest } = doc;
        updatedDoc = rest;
      }
    } catch (err) {
      console.warn("[Store] MongoDB updateService failed:", err.message);
    }
  }

  const index = localStore.services.findIndex(s => s.id === id);
  if (index !== -1) {
    localStore.services[index] = {
      ...localStore.services[index],
      ...updatedData,
      id
    };
    saveLocalStore();
    return updatedDoc || localStore.services[index];
  }

  return updatedDoc;
}

async function deleteService(id) {
  let deletedFromMongo = false;
  if (isMongoConnected()) {
    try {
      const res = await Service.deleteOne({ id });
      deletedFromMongo = res.deletedCount > 0;
    } catch (err) {
      console.warn("[Store] MongoDB deleteService failed:", err.message);
    }
  }

  const index = localStore.services.findIndex(s => s.id === id);
  if (index !== -1) {
    localStore.services.splice(index, 1);
    saveLocalStore();
    return true;
  }

  return deletedFromMongo;
}

// --- BOOKINGS OPERATIONS ---
async function getBookings() {
  if (isMongoConnected()) {
    try {
      const list = await Booking.find().sort({ createdAt: -1 }).limit(100).lean();
      if (list) {
        return list.map(item => {
          const { _id, __v, ...rest } = item;
          return rest;
        });
      }
    } catch (err) {
      console.warn("[Store] MongoDB getBookings failed:", err.message);
    }
  }
  return localStore.bookings;
}

async function addBooking(booking) {
  if (isMongoConnected()) {
    try {
      await Booking.create(booking);
    } catch (err) {
      console.warn("[Store] MongoDB addBooking failed:", err.message);
    }
  }

  localStore.bookings.unshift(booking);
  if (localStore.bookings.length > 100) {
    localStore.bookings = localStore.bookings.slice(0, 100);
  }
  saveLocalStore();
  return booking;
}

// --- RESET DEFAULTS ---
async function resetToDefaults() {
  if (isMongoConnected()) {
    try {
      await Service.deleteMany({});
      await Service.insertMany(defaultServices);
      await SiteConfig.findOneAndUpdate(
        { key: "main_config" },
        { $set: defaultConfig },
        { upsert: true }
      );
    } catch (err) {
      console.warn("[Store] MongoDB resetToDefaults failed:", err.message);
    }
  }

  localStore = {
    config: { ...defaultConfig },
    services: [...defaultServices],
    bookings: []
  };
  saveLocalStore();
  return localStore;
}

// Initialize local store on require
loadLocalStore();

module.exports = {
  getConfig,
  updateConfig,
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
  getBookings,
  addBooking,
  resetToDefaults
};

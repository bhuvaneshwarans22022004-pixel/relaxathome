# RelaxAtHome - Doorstep Massage & Spa Service Centre

A luxury, bilingual (English & Tamil) doorstep massage and home spa booking web application with direct WhatsApp integration and a full dynamic **Admin Control Panel**.

- **Frontend**: **.NET 9 ASP.NET Core** (Razor Pages) with luxury wellness design system, instant bilingual language switcher, duration pricing calculator, doorstep booking modal, and **Admin Control Panel** (`/Admin`).
- **Backend**: **Node.js (Express)** REST API with `.env` configuration, persistent JSON datastore, full Admin CRUD endpoints for card content, prices, contact details, locations, footer copy, and WhatsApp deep-link generation.
- **Languages**: **English** & **Tamil (தமிழ்)** with real-time toggle.
- **WhatsApp Integration**: Floating action widget, service card direct chats, and doorstep booking dispatch.

---

## 📁 Project Structure

```text
c:\test-project\relaxathome\
├── backend/                       # Node.js Express API
│   ├── .env                       # Backend Environment Variables
│   ├── .env.example               # Backend Environment Template
│   ├── package.json
│   ├── server.js                  # Express API Server with Admin CRUD
│   ├── data/
│   │   ├── servicesData.js        # Default Bilingual Doorstep Massage Catalog
│   │   ├── storeManager.js        # Persistent Store Manager (CRUD operations)
│   │   └── store.json             # Live Persistent Datastore (Editable via Admin)
│   └── utils/
│       └── whatsappHelper.js      # WhatsApp deep-link URL generator
│
└── frontend/                      # .NET 9 ASP.NET Core Web App
    ├── .env                       # Frontend Environment Variables (DotNetEnv)
    ├── .env.example               # Frontend Environment Template
    ├── appsettings.json           # ASP.NET Core Configuration
    ├── Program.cs                 # .NET Bootstrap with HttpClient & Env Loader
    ├── Models/
    │   └── AppModels.cs           # Shared Models (Services, Config, Locations, Bookings)
    ├── Pages/
    │   ├── Index.cshtml           # Luxury Bilingual Massage Portal
    │   ├── Index.cshtml.cs        # Dynamic Data Consumer & Fallbacks
    │   ├── Admin/
    │   │   ├── Index.cshtml       # Dynamic Admin Control Panel
    │   │   └── Index.cshtml.cs    # Admin Controller & API Integrations
    │   └── Shared/
    │       └── _Layout.cshtml     # Luxury Spa Layout, Dynamic Header/Footer, WhatsApp Widget
    └── wwwroot/
        ├── css/
        │   └── site.css           # Luxury Wellness Spa Theme (Sage, Forest Green & Gold)
        └── js/
            └── site.js            # Instant EN <-> தமிழ் Switcher & WhatsApp Booking Handler
```

---

## ⚙️ Environment Variables (.env Files)

### 1. Backend: `backend/.env`
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5200
WHATSAPP_PHONE=919876543210
COMPANY_NAME=RelaxAtHome Doorstep Massage & Spa
COMPANY_NAME_TA=ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் & ஸ்பா
SUPPORT_EMAIL=booking@relaxathome.in
SERVICE_CITIES=Chennai, Coimbatore, Madurai, Trichy, Bangalore
SERVICE_CITIES_TA=சென்னை, கோயம்புத்தூர், மதுரை, திருச்சி, பெங்களூர்
OPERATING_HOURS=8:00 AM - 10:00 PM (All 7 Days)
OPERATING_HOURS_TA=காலை 8:00 - இரவு 10:00 (7 நாட்களும்)
```

### 2. Frontend: `frontend/.env`
```env
ASPNETCORE_ENVIRONMENT=Development
BACKEND_API_URL=http://localhost:5000/api/
WHATSAPP_PHONE=919876543210
COMPANY_NAME=RelaxAtHome Doorstep Massage & Spa
COMPANY_NAME_TA=ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் & ஸ்பா
PORT=5290
```

---

## 🚀 Running the Project

### 1. Start Backend (Node.js)
```powershell
cd c:\test-project\relaxathome\backend
node server.js
```
*Backend runs on: `http://localhost:5000`*
- Public Health Check: `http://localhost:5000/api/health`
- Dynamic Config: `http://localhost:5000/api/config`
- Dynamic Services: `http://localhost:5000/api/services`
- Admin Endpoints: `PUT /api/admin/config`, `POST/PUT/DELETE /api/admin/services`

### 2. Start Frontend (.NET 9)
```powershell
cd c:\test-project\relaxathome\frontend
dotnet run --urls "http://localhost:5290"
```
*Frontend runs on: `http://localhost:5290`*
- **Main Website**: `http://localhost:5290/`
- **Admin Control Panel**: `http://localhost:5290/Admin`

---

## 🛠️ Admin Control Panel Features (`/Admin`)

1. **Massage Cards & Pricing Management**:
   - Live list of all doorstep massage cards.
   - **Edit Card Modal**: Modify English name, Tamil name, taglines, descriptions, oils used, category, and individual prices for 60m, 90m, and 120m durations.
   - **Popular Badge**: Toggle "Most Popular" highlight ribbon on any card.
   - **Add New Card**: Create brand new massage packages that instantly appear on the live site.
   - **Delete Card**: Remove outdated services.
2. **Contact & Operating Hours Management**:
   - Update WhatsApp phone number (for instant deep-link routing).
   - Update display phone number, support email, and working hours in English and Tamil.
3. **Service Locations & Zones Management**:
   - Manage serviced cities (Chennai, Coimbatore, Madurai, Trichy, Bangalore, etc.) and specific covered neighborhoods.
   - Adds/removes zones dynamically in the live footer and announcement bar.
4. **Footer & Brand Copy Management**:
   - Edit the company description in both English and Tamil.
5. **Recent Bookings Inspector**:
   - View customer submissions, phone numbers, chosen slots, addresses, and selected therapists.
6. **Reset to Defaults**:
   - One-click restore button to safely reset the catalog to original demo settings at any time.

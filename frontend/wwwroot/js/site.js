/**
 * RelaxAtHome - Bilingual (English / தமிழ்) & WhatsApp Doorstep Booking Manager
 */

(function () {
  'use strict';

  // Configuration injected from page or defaults
  const config = {
    whatsappPhone: window.RAH_CONFIG?.whatsappPhone || '919876543210',
    backendApiUrl: window.RAH_CONFIG?.backendApiUrl || 'http://localhost:5000/api'
  };

  let currentLang = localStorage.getItem('rah_lang') || 'en';
  let activeModalService = null;

  // Bilingual Dictionary for dynamically generated UI elements
  const i18n = {
    en: {
      bookingConfirmed: "Booking prepared! Redirecting to WhatsApp to confirm with our coordinator...",
      selectDuration: "Select Duration:",
      durationMins: "Minutes",
      errorFillRequired: "Please enter your Name, Phone Number, and Doorstep Address.",
      price: "Price:",
      therapistAny: "Any Available Certified Professional",
      therapistFemale: "Female Therapist Preferred",
      therapistMale: "Male Therapist Preferred",
      whatsappSubmitting: "Connecting to WhatsApp...",
      currencySymbol: "₹"
    },
    ta: {
      bookingConfirmed: "முன்பதிவு தயாராக உள்ளது! எங்கள் ஒருங்கிணைப்பாளருடன் உறுதிப்படுத்த வாட்ஸ்அப் திறக்கப்படுகிறது...",
      selectDuration: "கால அளவு தேர்வு:",
      durationMins: "நிமிடங்கள்",
      errorFillRequired: "தயவுசெய்து உங்கள் பெயர், தொலைபேசி எண் மற்றும் வீட்டு முகவரியை உள்ளிடவும்.",
      price: "கட்டணம்:",
      therapistAny: "சான்றளிக்கப்பட்ட நிபுணர் (ஆண்/பெண்)",
      therapistFemale: "பெண் நிபுணர் விருப்பம்",
      therapistMale: "ஆண் நிபுணர் விருப்பம்",
      whatsappSubmitting: "வாட்ஸ்அப் உடன் இணைக்கிறது...",
      currencySymbol: "₹"
    }
  };

  // Set Language function
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('rah_lang', lang);
    document.documentElement.lang = lang;

    // Toggle active class on language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update body class for Tamil font styling
    document.body.classList.toggle('tamil-active', lang === 'ta');

    // Translate all elements with data-en and data-ta
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = lang === 'ta' ? (el.getAttribute('data-ta') || el.getAttribute('data-en')) : el.getAttribute('data-en');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    });

    // Update dynamic WhatsApp floating button link
    updateFloatingWhatsAppLink();

    console.log(`Language set to: ${lang}`);
  }

  // Update floating WhatsApp deep link based on language
  function updateFloatingWhatsAppLink() {
    const floatBtn = document.getElementById('floatingWhatsAppBtn');
    if (!floatBtn) return;

    let msg = "";
    if (currentLang === 'ta') {
      msg = "வணக்கம்! ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் சேவைகள், கட்டணங்கள் மற்றும் எனது பகுதியில் உள்ள நிபுணர்கள் பற்றி அறிய விரும்புகிறேன்.";
    } else {
      msg = "Hello! I want to know more about your RelaxAtHome doorstep massage services, pricing, and therapist availability.";
    }
    floatBtn.href = `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(msg)}`;
  }

  // Handle service card duration chip clicks to update card price display
  function setupServiceCardDurationPills() {
    document.querySelectorAll('.service-card').forEach(card => {
      const chips = card.querySelectorAll('.duration-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', function () {
          chips.forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
        });
      });
    });
  }

  // Open Doorstep Booking Modal with selected service
  window.openBookingModal = function (serviceId, serviceNameEn, serviceNameTa, defaultPrice, defaultMinutes, durationsJson) {
    try {
      let durations = [];
      if (typeof durationsJson === 'string') {
        durations = JSON.parse(durationsJson);
      } else if (Array.isArray(durationsJson)) {
        durations = durationsJson;
      }

      activeModalService = {
        id: serviceId,
        nameEn: serviceNameEn,
        nameTa: serviceNameTa,
        durations: durations
      };

      const titleEl = document.getElementById('modalServiceTitle');
      if (titleEl) {
        titleEl.textContent = currentLang === 'ta' ? serviceNameTa : serviceNameEn;
      }

      // Populate duration radio / select in modal
      const durationSelect = document.getElementById('modalDurationSelect');
      if (durationSelect && durations.length > 0) {
        durationSelect.innerHTML = '';
        durations.forEach(d => {
          const opt = document.createElement('option');
          opt.value = d.minutes;
          opt.setAttribute('data-price', d.price);
          opt.textContent = `${d.minutes} ${currentLang === 'ta' ? 'நிமிடங்கள்' : 'Mins'} - ₹${d.price}`;
          if (d.minutes === Number(defaultMinutes)) {
            opt.selected = true;
          }
          durationSelect.appendChild(opt);
        });
      }

      updateModalPrice();

      const modalElement = document.getElementById('doorstepBookingModal');
      if (modalElement && window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
      }
    } catch (e) {
      console.error('Error opening booking modal:', e);
    }
  };

  // Update modal price display when duration changes
  function updateModalPrice() {
    const durationSelect = document.getElementById('modalDurationSelect');
    const priceDisplay = document.getElementById('modalPriceDisplay');
    if (!durationSelect || !priceDisplay) return;

    const selectedOption = durationSelect.options[durationSelect.selectedIndex];
    if (selectedOption) {
      const price = selectedOption.getAttribute('data-price') || '1799';
      priceDisplay.textContent = `₹${price}`;
    }
  }

  // Client-side fallback WhatsApp message generator
  function createDirectWhatsAppUrl(formData) {
    const isTa = currentLang === 'ta';
    let message = "";

    if (isTa) {
      message = `🌿 *வணக்கம்! ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் முன்பதிவு* 🌿\n\n` +
        `👤 *பெயர்:* ${formData.name}\n` +
        `📞 *தொலைபேசி:* ${formData.phone}\n` +
        `💆 *மசாஜ் சேவை:* ${formData.serviceName}\n` +
        `⏱️ *கால அளவு:* ${formData.duration} நிமிடங்கள்\n` +
        `💰 *கட்டணம்:* ₹${formData.price}\n` +
        `📅 *தேதி:* ${formData.date}\n` +
        `⏰ *நேரம்:* ${formData.timeSlot}\n` +
        `👨‍⚕️ *நிபுணர் விருப்பம்:* ${formData.therapist}\n` +
        `📍 *வீட்டு முகவரி:* ${formData.address}${formData.landmark ? ` (அருகில்: ${formData.landmark})` : ''}\n` +
        (formData.notes ? `📝 *குறிப்பு:* ${formData.notes}\n` : '') +
        `\nதயவுசெய்து இந்த முன்பதிவை உறுதிசெய்து நிபுணரின் வருகை நேரத்தை தெரிவிக்கவும். நன்றி! 🙏`;
    } else {
      message = `🌿 *Hello! Doorstep Massage Booking Request* 🌿\n\n` +
        `👤 *Name:* ${formData.name}\n` +
        `📞 *Phone:* ${formData.phone}\n` +
        `💆 *Massage Service:* ${formData.serviceName}\n` +
        `⏱️ *Duration:* ${formData.duration} Mins\n` +
        `💰 *Estimated Price:* ₹${formData.price}\n` +
        `📅 *Date:* ${formData.date}\n` +
        `⏰ *Preferred Time:* ${formData.timeSlot}\n` +
        `👨‍⚕️ *Therapist Preference:* ${formData.therapist}\n` +
        `📍 *Doorstep Address:* ${formData.address}${formData.landmark ? ` (Landmark: ${formData.landmark})` : ''}\n` +
        (formData.notes ? `📝 *Special Notes:* ${formData.notes}\n` : '') +
        `\nPlease confirm therapist dispatch for this booking. Thank you!`;
    }

    return `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(message)}`;
  }

  // Handle Doorstep Booking Form Submit
  async function handleBookingFormSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('bookCustName');
    const phoneInput = document.getElementById('bookCustPhone');
    const addressInput = document.getElementById('bookCustAddress');
    const landmarkInput = document.getElementById('bookCustLandmark');
    const dateInput = document.getElementById('bookCustDate');
    const timeSlotInput = document.getElementById('bookCustTime');
    const therapistSelect = document.getElementById('bookTherapistPref');
    const notesInput = document.getElementById('bookCustNotes');
    const durationSelect = document.getElementById('modalDurationSelect');
    const submitBtn = document.getElementById('btnSubmitBooking');

    if (!nameInput.value.trim() || !phoneInput.value.trim() || !addressInput.value.trim()) {
      alert(i18n[currentLang].errorFillRequired);
      return;
    }

    const selectedOption = durationSelect ? durationSelect.options[durationSelect.selectedIndex] : null;
    const durationMinutes = selectedOption ? Number(selectedOption.value) : 60;
    const price = selectedOption ? selectedOption.getAttribute('data-price') : '1799';
    const serviceName = currentLang === 'ta' ? (activeModalService?.nameTa || 'மசாஜ் சேவை') : (activeModalService?.nameEn || 'Massage Service');

    const bookingPayload = {
      customerName: nameInput.value.trim(),
      customerPhone: phoneInput.value.trim(),
      serviceId: activeModalService?.id || 'deep-tissue',
      serviceName: serviceName,
      duration: durationMinutes,
      price: price,
      preferredDate: dateInput ? dateInput.value : new Date().toISOString().split('T')[0],
      timeSlot: timeSlotInput ? timeSlotInput.value : 'Flexible / உடனடி',
      therapistPreference: therapistSelect ? therapistSelect.value : 'Any',
      address: addressInput.value.trim(),
      landmark: landmarkInput ? landmarkInput.value.trim() : '',
      specialNotes: notesInput ? notesInput.value.trim() : '',
      language: currentLang
    };

    // Button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-brands fa-whatsapp fa-spin"></i> ${i18n[currentLang].whatsappSubmitting}`;

    let whatsappTargetUrl = null;

    try {
      // Send booking to Node.js backend
      const response = await fetch(`${config.backendApiUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.whatsappUrl) {
          whatsappTargetUrl = data.whatsappUrl;
        }
      }
    } catch (err) {
      console.warn('Backend API connection note (using direct WhatsApp dispatch):', err.message);
    }

    // If backend wasn't reachable or didn't return URL, use client-side generator
    if (!whatsappTargetUrl) {
      whatsappTargetUrl = createDirectWhatsAppUrl({
        name: bookingPayload.customerName,
        phone: bookingPayload.customerPhone,
        serviceName: bookingPayload.serviceName,
        duration: bookingPayload.duration,
        price: bookingPayload.price,
        date: bookingPayload.preferredDate,
        timeSlot: bookingPayload.timeSlot,
        therapist: bookingPayload.therapistPreference,
        address: bookingPayload.address,
        landmark: bookingPayload.landmark,
        notes: bookingPayload.specialNotes
      });
    }

    // Close modal
    const modalElement = document.getElementById('doorstepBookingModal');
    if (modalElement && window.bootstrap) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }

    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    // Show friendly success toast/alert then redirect to WhatsApp
    window.open(whatsappTargetUrl, '_blank');
  }

  // Quick WhatsApp Inquiry for a specific service card
  window.openQuickServiceWhatsApp = function (serviceNameEn, serviceNameTa) {
    const isTa = currentLang === 'ta';
    const sName = isTa ? serviceNameTa : serviceNameEn;
    let msg = "";

    if (isTa) {
      msg = `வணக்கம்! நான் உங்கள் '${sName}' இல்ல மசாஜ் சேவை பற்றிய விவரங்கள், கட்டணம் மற்றும் இன்றைய முன்பதிவு பற்றி அறிய விரும்புகிறேன்.`;
    } else {
      msg = `Hello! I would like to inquire about your doorstep '${sName}' massage service and therapist availability today.`;
    }

    const url = `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Initialize event listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Set initial language from storage
    setLanguage(currentLang);

    // Language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const lang = this.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    // Duration change in modal
    const durationSelect = document.getElementById('modalDurationSelect');
    if (durationSelect) {
      durationSelect.addEventListener('change', updateModalPrice);
    }

    // Booking form submit
    const bookingForm = document.getElementById('doorstepBookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', handleBookingFormSubmit);
    }

    // Set today's date as min for date input
    const dateInput = document.getElementById('bookCustDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    setupServiceCardDurationPills();
    updateFloatingWhatsAppLink();
  });

})();

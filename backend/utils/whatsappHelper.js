/**
 * WhatsApp Message Generator Helper
 * Generates formatted click-to-chat WhatsApp deep links in English and Tamil
 */

function generateWhatsAppBookingUrl({
  whatsappPhone,
  language = "en",
  bookingId,
  customerName,
  customerPhone,
  serviceName,
  duration,
  price,
  preferredDate,
  timeSlot,
  therapistPreference,
  address,
  landmark,
  specialNotes
}) {
  const isTamil = language === "ta";

  let message = "";

  if (isTamil) {
    message = `🌿 *வணக்கம்! ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் முன்பதிவு* 🌿\n\n` +
      `📋 *முன்பதிவு எண்:* #${bookingId}\n` +
      `👤 *பெயர்:* ${customerName}\n` +
      `📞 *வாடிக்கையாளர் எண்:* ${customerPhone}\n` +
      `💆 *தேர்ந்தெடுக்கப்பட்ட மசாஜ்:* ${serviceName}\n` +
      `⏱️ *கால அளவு:* ${duration} நிமிடங்கள்\n` +
      `💰 *கட்டணம்:* ₹${price}\n` +
      `📅 *தேதி:* ${preferredDate}\n` +
      `⏰ *நேரம்:* ${timeSlot}\n` +
      `👨‍⚕️ *நிபுணர் விருப்பம்:* ${therapistPreference}\n` +
      `📍 *முகவரி:* ${address}${landmark ? ` (அருகில்: ${landmark})` : ""}\n` +
      (specialNotes ? `📝 *குறிப்பு:* ${specialNotes}\n` : "") +
      `\nதயவுசெய்து இந்த முன்பதிவை உறுதிசெய்து நிபுணரின் வருகை நேரத்தை தெரிவிக்கவும். நன்றி! 🙏`;
  } else {
    message = `🌿 *Hello! Doorstep Massage Booking Request* 🌿\n\n` +
      `📋 *Booking ID:* #${bookingId}\n` +
      `👤 *Name:* ${customerName}\n` +
      `📞 *Phone:* ${customerPhone}\n` +
      `💆 *Massage Service:* ${serviceName}\n` +
      `⏱️ *Duration:* ${duration} Mins\n` +
      `💰 *Amount:* ₹${price}\n` +
      `📅 *Date:* ${preferredDate}\n` +
      `⏰ *Time Slot:* ${timeSlot}\n` +
      `👨‍⚕️ *Therapist Preference:* ${therapistPreference}\n` +
      `📍 *Doorstep Address:* ${address}${landmark ? ` (Landmark: ${landmark})` : ""}\n` +
      (specialNotes ? `📝 *Special Notes:* ${specialNotes}\n` : "") +
      `\nPlease confirm this booking slot and therapist dispatch. Thank you!`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
}

function generateQuickWhatsAppInquiryUrl({ whatsappPhone, language = "en", serviceName = null }) {
  const isTamil = language === "ta";
  let message = "";

  if (serviceName) {
    if (isTamil) {
      message = `வணக்கம்! நான் உங்கள் '${serviceName}' இல்ல மசாஜ் சேவை பற்றி விவரங்கள் மற்றும் இன்றைய முன்பதிவு பற்றி அறிய விரும்புகிறேன்.`;
    } else {
      message = `Hello! I would like to inquire about your doorstep '${serviceName}' massage service and availability today.`;
    }
  } else {
    if (isTamil) {
      message = `வணக்கம்! உங்கள் ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் சேவைகள், கட்டணங்கள் மற்றும் எனது பகுதியில் உள்ள நிபுணர்கள் பற்றி அறிய விரும்புகிறேன்.`;
    } else {
      message = `Hello! I want to know more about your doorstep massage services, pricing, and therapist availability in my area.`;
    }
  }

  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}

module.exports = {
  generateWhatsAppBookingUrl,
  generateQuickWhatsAppInquiryUrl
};

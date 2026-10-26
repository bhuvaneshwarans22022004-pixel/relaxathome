// Doorstep Massage Services Catalog with English & Tamil content
const services = [
  {
    id: "deep-tissue",
    name_en: "Deep Tissue Muscle Relief Massage",
    name_ta: "ஆழ்ந்த தசை வலி நிவாரண மசாஜ்",
    tagline_en: "Relieves chronic knots, backaches & stiff shoulders",
    tagline_ta: "நாள்பட்ட தசை பிடிப்பு, முதுகு வலி மற்றும் தோள்பட்டை விறைப்பை நீக்குகிறது",
    description_en: "Our specialized therapist applies firm, targeted pressure to reach deeper layers of muscle tissue. Perfect for professionals, gym enthusiasts, and anyone suffering from desk fatigue.",
    description_ta: "எங்கள் அனுபவம் வாய்ந்த நிபுணர் ஆழமான தசை அடுக்குகளை தளர்த்த மிதமான மற்றும் அழுத்தமான மசாஜ் செய்கிறார். அலுவலக பணி மற்றும் உடற்பயிற்சி செய்பவர்களுக்கு உகந்தது.",
    category_en: "Pain Relief",
    category_ta: "வலி நிவாரணம்",
    durations: [
      { minutes: 60, price: 1799, originalPrice: 2299 },
      { minutes: 90, price: 2399, originalPrice: 2999 },
      { minutes: 120, price: 3099, originalPrice: 3899 }
    ],
    oils_en: "Eucalyptus & Wintergreen Herbal Infused Oil",
    oils_ta: "நீலகிரி தைலம் மற்றும் மூலிகை கலந்த இயற்கை எண்ணெய்",
    therapist_available: ["Male", "Female"],
    icon: "fa-solid fa-hand-holding-heart",
    popular: true
  },
  {
    id: "ayurvedic-abhyanga",
    name_en: "Traditional Ayurvedic Abhyanga",
    name_ta: "பாரம்பரிய ஆயுர்வேத அபியங்கம்",
    tagline_en: "Ancient healing therapy for total body rejuvenation & detox",
    tagline_ta: "முழு உடல் புத்துணர்ச்சி மற்றும் நச்சு நீக்கத்திற்கான பாரம்பரிய ஆயுர்வேத சிகிச்சை",
    description_en: "Warm medicated Ayurvedic herbal oils stroked rhythmically across 107 vital Marma energy points. Enhances blood circulation, improves sleep quality, and restores biological balance.",
    description_ta: "சூடான மூலிகை எண்ணெய்களைக் கொண்டு மர்ம புள்ளிகளில் செய்யப்படும் சீரான மசாஜ். ரத்த ஓட்டத்தை சீராக்கி, ஆழ்ந்த தூக்கத்தையும் உடல் அமைதியையும் தரும்.",
    category_en: "Ayurveda & Detox",
    category_ta: "ஆயுர்வேதம் & நச்சு நீக்கம்",
    durations: [
      { minutes: 60, price: 1899, originalPrice: 2499 },
      { minutes: 90, price: 2499, originalPrice: 3199 },
      { minutes: 120, price: 3299, originalPrice: 4099 }
    ],
    oils_en: "Warm Dhanwantharam & Sesame Medicated Oil",
    oils_ta: "சூடான தன்வந்தரம் மற்றும் எள் மூலிகை எண்ணெய்",
    therapist_available: ["Male", "Female"],
    icon: "fa-solid fa-spa",
    popular: true
  },
  {
    id: "aromatherapy",
    name_en: "Luxury Aromatherapy Relaxation Massage",
    name_ta: "சொகுசு நறுமண எண்ணெய் மசாஜ்",
    tagline_en: "Gentle Swedish strokes with organic calming essential oils",
    tagline_ta: "இயற்கை நறுமண எண்ணெய்களுடன் மென்மையான மன அமைதி மசாஜ்",
    description_en: "Immerse your senses in fragrant lavender, chamomile, and bergamot blends. Relieves nervous tension, calms overactive minds, and leaves your skin feeling silky smooth and nourished.",
    description_ta: "லாவெண்டர் மற்றும் கெமோமில் போன்ற இயற்கை பூக்களின் நறுமண எண்ணெய்களுடன் கூடிய சிகிச்சை. மன அழுத்தத்தைப் போக்கி உடலை முழுமையாக இளைப்பாறச் செய்யும்.",
    category_en: "Stress Relief",
    category_ta: "மன அமைதி",
    durations: [
      { minutes: 60, price: 1699, originalPrice: 2199 },
      { minutes: 90, price: 2299, originalPrice: 2899 },
      { minutes: 120, price: 2999, originalPrice: 3699 }
    ],
    oils_en: "French Lavender & Sweet Orange Essential Oil",
    oils_ta: "பிரெஞ்சு லாவெண்டர் மற்றும் ஆரஞ்சு நறுமண எண்ணெய்",
    therapist_available: ["Male", "Female"],
    icon: "fa-solid fa-feather-pointed",
    popular: false
  },
  {
    id: "swedish-relaxation",
    name_en: "Swedish Full Body Vitality Massage",
    name_ta: "ஸ்வீடிஷ் முழு உடல் புத்துணர்ச்சி மசாஜ்",
    tagline_en: "Long gliding strokes to stimulate lymphatic drainage & blood flow",
    tagline_ta: "நீண்ட மென்மையான மசாஜ் மூலம் ரத்த ஓட்டத்தை அதிகரிக்கும் உத்தி",
    description_en: "Classic European massage technique employing effleurage, petrissage, and tapping. Releases daily fatigue, relaxes tired muscles, and boosts your daytime energy levels.",
    description_ta: "கிளாசிக் ஐரோப்பிய மசாஜ் முறை. தினசரி உடல் சோர்வை அகற்றி, தசைகளை தளர்வாக்கி உடனடி புத்துணர்ச்சியை அளிக்கிறது.",
    category_en: "Vitality",
    category_ta: "உடல் சக்தி",
    durations: [
      { minutes: 60, price: 1599, originalPrice: 1999 },
      { minutes: 90, price: 2199, originalPrice: 2699 },
      { minutes: 120, price: 2799, originalPrice: 3499 }
    ],
    oils_en: "Cold-Pressed Sweet Almond & Jojoba Oil",
    oils_ta: "குளிர்ந்த அழுத்தப்பட்ட பாதாம் & ஜோஜோபா எண்ணெய்",
    therapist_available: ["Male", "Female"],
    icon: "fa-solid fa-wind",
    popular: false
  },
  {
    id: "foot-reflexology",
    name_en: "Foot Reflexology & Calf Recovery",
    name_ta: "பாத அழுத்த மற்றும் கால் வலி நிவாரணம்",
    tagline_en: "Acupressure on reflex zones to balance internal organs",
    tagline_ta: "பாத அக்குபிரஷர் புள்ளிகளில் அழுத்தம் கொடுத்து உடலை சீரமைக்கும் சிகிச்சை",
    description_en: "Focuses on pressure points in the soles, ankles, and calf muscles. Alleviates plantar fasciitis, heel pain, and heavy legs from standing or walking all day.",
    description_ta: "உள்ளங்கால், கணுக்கால் மற்றும் கெண்டைக்கால் தசைகளில் சிறப்பு அழுத்தம். குதிகால் வலி, கால் குடைச்சல் ஆகியவற்றுக்கு சிறந்த தீர்வு.",
    category_en: "Targeted Therapy",
    category_ta: "குறிப்பிட்ட சிகிச்சை",
    durations: [
      { minutes: 45, price: 1199, originalPrice: 1599 },
      { minutes: 60, price: 1499, originalPrice: 1899 },
      { minutes: 90, price: 1999, originalPrice: 2499 }
    ],
    oils_en: "Peppermint & Tea Tree Cooling Cream / Oil",
    oils_ta: "புதினா & டீ ட்ரீ குளிர்ச்சி தரும் மூலிகை தைலம்",
    therapist_available: ["Male", "Female"],
    icon: "fa-solid fa-shoe-prints",
    popular: false
  },
  {
    id: "couples-home-spa",
    name_en: "Couples Luxury Home Spa Experience",
    name_ta: "தம்பதியர் சொகுசு இல்ல ஸ்பா பேக்கேஜ்",
    tagline_en: "Two therapists, two portable spa beds, side-by-side bliss at home",
    tagline_ta: "இரண்டு நிபுணர்கள், இரண்டு படுக்கைகள், உங்கள் இல்லத்திலேயே இரட்டை சுகம்",
    description_en: "Transform your living room or master bedroom into a 5-star spa sanctuary. Includes choice of massage for both partners, soothing aroma diffuser setup, and warm herbal towels.",
    description_ta: "உங்கள் வீட்டின் வசதியிலேயே 5-நட்சத்திர ஸ்பா அனுபவம். இருவருக்கும் விருப்பமான மசாஜ், நறுமண டிஃப்பியூசர் மற்றும் வெதுவெதுப்பான மூலிகை துண்டுகள் அடங்கும்.",
    category_en: "Special Package",
    category_ta: "சிறப்பு பேக்கேஜ்",
    durations: [
      { minutes: 60, price: 3299, originalPrice: 4299 },
      { minutes: 90, price: 4499, originalPrice: 5699 },
      { minutes: 120, price: 5799, originalPrice: 7299 }
    ],
    oils_en: "Custom Aromatherapy or Ayurvedic Oil Selection",
    oils_ta: "விருப்பமான நறுமணம் அல்லது ஆயுர்வேத எண்ணெய் தேர்வு",
    therapist_available: ["Male & Female Team", "Female Therapists", "Male Therapists"],
    icon: "fa-solid fa-heart",
    popular: true
  }
];

const testimonials = [
  {
    id: 1,
    name: "Dr. K. Senthil Nathan",
    city: "Chennai (Adyar)",
    rating: 5,
    comment_en: "Incredible doorstep service! The therapist brought a comfortable foldable bed, disposable linens, and soothing music. After a long hospital surgery shift, my lower back pain completely vanished.",
    comment_ta: "மிகவும் அருமையான இல்ல சேவை! மசாஜ் படுக்கை, துண்டுகள் அனைத்தையும் அவர்களே கொண்டு வந்தனர். நீண்ட அறுவை சிகிச்சை பணிக்குப் பிறகு முதுகு வலி முற்றிலும் நீங்கியது.",
    service: "Deep Tissue Muscle Relief",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Priya Lakshmi R.",
    city: "Coimbatore (RS Puram)",
    rating: 5,
    comment_en: "I was hesitant about home massage at first, but the female therapist was certified, extremely polite, and maintained complete privacy. The Ayurvedic Abhyanga was deeply therapeutic.",
    comment_ta: "முதலில் சற்று தயங்கினேன், ஆனால் வந்த பெண் நிபுணர் மிகவும் கண்ணியமாகவும் தொழில்முறையாகவும் இருந்தார். ஆயுர்வேத அபியங்கம் மிகச் சிறப்பான புத்துணர்வை தந்தது.",
    service: "Traditional Ayurvedic Abhyanga",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Arun & Meera Kumar",
    city: "Chennai (OMR)",
    rating: 5,
    comment_en: "Booked the Couples Home Spa via WhatsApp on Sunday. Within 45 minutes, two therapists arrived fully equipped. It felt like a luxury resort in our own flat!",
    comment_ta: "ஞாயிற்றுக்கிழமை வாட்ஸ்அப் மூலம் தம்பதியர் ஸ்பா பதிவு செய்தோம். 45 நிமிடங்களில் உபகரணங்களுடன் வந்தனர். எங்கள் வீட்டிலேயே ரிசார்ட் போன்ற உணர்வு!",
    service: "Couples Luxury Home Spa",
    date: "3 days ago"
  }
];

module.exports = {
  services,
  testimonials
};

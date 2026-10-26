using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;
using RelaxAtHome.Frontend.Models;

namespace RelaxAtHome.Frontend.Pages;

public class ServicesApiResponse
{
    public int Count { get; set; }
    public List<MassageService> Services { get; set; } = new();
}

public class IndexModel : PageModel
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<IndexModel> _logger;

    public List<MassageService> Services { get; set; } = new();
    public SiteConfig Config { get; set; } = new();
    public string WhatsAppPhone => Config.WhatsAppPhone;
    public string BackendApiUrl { get; set; } = "http://localhost:5000/api";
    public bool IsBackendOnline { get; set; } = false;

    public IndexModel(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<IndexModel> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task OnGetAsync()
    {
        BackendApiUrl = Environment.GetEnvironmentVariable("BACKEND_API_URL") 
                        ?? _configuration["AppSettings:BackendApiUrl"] 
                        ?? "http://localhost:5000/api";

        try
        {
            var client = _httpClientFactory.CreateClient("NodeBackend");
            
            // 1. Fetch Dynamic Site Config
            var configResponse = await client.GetAsync("config");
            if (configResponse.IsSuccessStatusCode)
            {
                var configJson = await configResponse.Content.ReadAsStringAsync();
                var fetchedConfig = JsonSerializer.Deserialize<SiteConfig>(configJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (fetchedConfig != null)
                {
                    Config = fetchedConfig;
                }
            }

            // 2. Fetch Dynamic Services
            var response = await client.GetAsync("services");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<ServicesApiResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (apiResponse != null && apiResponse.Services.Any())
                {
                    Services = apiResponse.Services;
                    IsBackendOnline = true;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Node.js backend not reachable, using fallback: {Message}", ex.Message);
        }

        // Fallbacks
        if (!Services.Any())
        {
            Services = GetFallbackServices();
        }
        if (string.IsNullOrEmpty(Config.WhatsAppPhone))
        {
            Config.WhatsAppPhone = Environment.GetEnvironmentVariable("WHATSAPP_PHONE") ?? "919876543210";
        }
    }

    private List<MassageService> GetFallbackServices()
    {
        return new List<MassageService>
        {
            new()
            {
                Id = "deep-tissue",
                NameEn = "Deep Tissue Muscle Relief Massage",
                NameTa = "ஆழ்ந்த தசை வலி நிவாரண மசாஜ்",
                TaglineEn = "Relieves chronic knots, backaches & stiff shoulders",
                TaglineTa = "நாள்பட்ட தசை பிடிப்பு, முதுகு வலி மற்றும் தோள்பட்டை விறைப்பை நீக்குகிறது",
                DescriptionEn = "Our specialized therapist applies firm, targeted pressure to reach deeper layers of muscle tissue. Perfect for professionals, gym enthusiasts, and anyone suffering from desk fatigue.",
                DescriptionTa = "எங்கள் அனுபவம் வாய்ந்த நிபுணர் ஆழமான தசை அடுக்குகளை தளர்த்த மிதமான மற்றும் அழுத்தமான மசாஜ் செய்கிறார். அலுவலக பணி மற்றும் உடற்பயிற்சி செய்பவர்களுக்கு உகந்தது.",
                CategoryEn = "Pain Relief",
                CategoryTa = "வலி நிவாரணம்",
                Durations = new()
                {
                    new() { Minutes = 60, Price = 1799, OriginalPrice = 2299 },
                    new() { Minutes = 90, Price = 2399, OriginalPrice = 2999 },
                    new() { Minutes = 120, Price = 3099, OriginalPrice = 3899 }
                },
                OilsEn = "Eucalyptus & Wintergreen Herbal Infused Oil",
                OilsTa = "நீலகிரி தைலம் மற்றும் மூலிகை கலந்த இயற்கை எண்ணெய்",
                TherapistAvailable = new() { "Male", "Female" },
                Icon = "fa-solid fa-hand-holding-heart",
                Popular = true
            },
            new()
            {
                Id = "ayurvedic-abhyanga",
                NameEn = "Traditional Ayurvedic Abhyanga",
                NameTa = "பாரம்பரிய ஆயுர்வேத அபியங்கம்",
                TaglineEn = "Ancient healing therapy for total body rejuvenation & detox",
                TaglineTa = "முழு உடல் புத்துணர்ச்சி மற்றும் நச்சு நீக்கத்திற்கான பாரம்பரிய ஆயுர்வேத சிகிச்சை",
                DescriptionEn = "Warm medicated Ayurvedic herbal oils stroked rhythmically across 107 vital Marma energy points. Enhances blood circulation, improves sleep quality, and restores biological balance.",
                DescriptionTa = "சூடான மூலிகை எண்ணெய்களைக் கொண்டு மர்ம புள்ளிகளில் செய்யப்படும் சீரான மசாஜ். ரத்த ஓட்டத்தை சீராக்கி, ஆழ்ந்த தூக்கத்தையும் உடல் அமைதியையும் தரும்.",
                CategoryEn = "Ayurveda & Detox",
                CategoryTa = "ஆயுர்வேதம் & நச்சு நீக்கம்",
                Durations = new()
                {
                    new() { Minutes = 60, Price = 1899, OriginalPrice = 2499 },
                    new() { Minutes = 90, Price = 2499, OriginalPrice = 3199 },
                    new() { Minutes = 120, Price = 3299, OriginalPrice = 4099 }
                },
                OilsEn = "Warm Dhanwantharam & Sesame Medicated Oil",
                OilsTa = "சூடான தன்வந்தரம் மற்றும் எள் மூலிகை எண்ணெய்",
                TherapistAvailable = new() { "Male", "Female" },
                Icon = "fa-solid fa-spa",
                Popular = true
            },
            new()
            {
                Id = "aromatherapy",
                NameEn = "Luxury Aromatherapy Relaxation Massage",
                NameTa = "சொகுசு நறுமண எண்ணெய் மசாஜ்",
                TaglineEn = "Gentle Swedish strokes with organic calming essential oils",
                TaglineTa = "இயற்கை நறுமண எண்ணெய்களுடன் மென்மையான மன அமைதி மசாஜ்",
                DescriptionEn = "Immerse your senses in fragrant lavender, chamomile, and bergamot blends. Relieves nervous tension, calms overactive minds, and leaves your skin feeling silky smooth and nourished.",
                DescriptionTa = "லாவெண்டர் மற்றும் கெமோமில் போன்ற இயற்கை பூக்களின் நறுமண எண்ணெய்களுடன் கூடிய சிகிச்சை. மன அழுத்தத்தைப் போக்கி உடலை முழுமையாக இளைப்பாறச் செய்யும்.",
                CategoryEn = "Stress Relief",
                CategoryTa = "மன அமைதி",
                Durations = new()
                {
                    new() { Minutes = 60, Price = 1699, OriginalPrice = 2199 },
                    new() { Minutes = 90, Price = 2299, OriginalPrice = 2899 },
                    new() { Minutes = 120, Price = 2999, OriginalPrice = 3699 }
                },
                OilsEn = "French Lavender & Sweet Orange Essential Oil",
                OilsTa = "பிரெஞ்சு லாவெண்டர் மற்றும் ஆரஞ்சு நறுமண எண்ணெய்",
                TherapistAvailable = new() { "Male", "Female" },
                Icon = "fa-solid fa-feather-pointed",
                Popular = false
            },
            new()
            {
                Id = "swedish-relaxation",
                NameEn = "Swedish Full Body Vitality Massage",
                NameTa = "ஸ்வீடிஷ் முழு உடல் புத்துணர்ச்சி மசாஜ்",
                TaglineEn = "Long gliding strokes to stimulate lymphatic drainage & blood flow",
                TaglineTa = "நீண்ட மென்மையான மசாஜ் மூலம் ரத்த ஓட்டத்தை அதிகரிக்கும் உத்தி",
                DescriptionEn = "Classic European massage technique employing effleurage, petrissage, and tapping. Releases daily fatigue, relaxes tired muscles, and boosts your daytime energy levels.",
                DescriptionTa = "கிளாசிக் ஐரோப்பிய மசாஜ் முறை. தினசரி உடல் சோர்வை அகற்றி, தசைகளை தளர்வாக்கி உடனடி புத்துணர்ச்சியை அளிக்கிறது.",
                CategoryEn = "Vitality",
                CategoryTa = "உடல் சக்தி",
                Durations = new()
                {
                    new() { Minutes = 60, Price = 1599, OriginalPrice = 1999 },
                    new() { Minutes = 90, Price = 2199, OriginalPrice = 2699 },
                    new() { Minutes = 120, Price = 2799, OriginalPrice = 3499 }
                },
                OilsEn = "Cold-Pressed Sweet Almond & Jojoba Oil",
                OilsTa = "குளிர்ந்த அழுத்தப்பட்ட பாதாம் & ஜோஜோபா எண்ணெய்",
                TherapistAvailable = new() { "Male", "Female" },
                Icon = "fa-solid fa-wind",
                Popular = false
            },
            new()
            {
                Id = "foot-reflexology",
                NameEn = "Foot Reflexology & Calf Recovery",
                NameTa = "பாத அழுத்த மற்றும் கால் வலி நிவாரணம்",
                TaglineEn = "Acupressure on reflex zones to balance internal organs",
                TaglineTa = "பாத அக்குபிரஷர் புள்ளிகளில் அழுத்தம் கொடுத்து உடலை சீரமைக்கும் சிகிச்சை",
                DescriptionEn = "Focuses on pressure points in the soles, ankles, and calf muscles. Alleviates plantar fasciitis, heel pain, and heavy legs from standing or walking all day.",
                DescriptionTa = "உள்ளங்கால், கணுக்கால் மற்றும் கெண்டைக்கால் தசைகளில் சிறப்பு அழுத்தம். குதிகால் வலி, கால் குடைச்சல் ஆகியவற்றுக்கு சிறந்த தீர்வு.",
                CategoryEn = "Targeted Therapy",
                CategoryTa = "குறிப்பிட்ட சிகிச்சை",
                Durations = new()
                {
                    new() { Minutes = 45, Price = 1199, OriginalPrice = 1599 },
                    new() { Minutes = 60, Price = 1499, OriginalPrice = 1899 },
                    new() { Minutes = 90, Price = 1999, OriginalPrice = 2499 }
                },
                OilsEn = "Peppermint & Tea Tree Cooling Cream / Oil",
                OilsTa = "புதினா & டீ ட்ரீ குளிர்ச்சி தரும் மூலிகை தைலம்",
                TherapistAvailable = new() { "Male", "Female" },
                Icon = "fa-solid fa-shoe-prints",
                Popular = false
            },
            new()
            {
                Id = "couples-home-spa",
                NameEn = "Couples Luxury Home Spa Experience",
                NameTa = "தம்பதியர் சொகுசு இல்ல ஸ்பா பேக்கேஜ்",
                TaglineEn = "Two therapists, two portable spa beds, side-by-side bliss at home",
                TaglineTa = "இரண்டு நிபுணர்கள், இரண்டு படுக்கைகள், உங்கள் இல்லத்திலேயே இரட்டை சுகம்",
                DescriptionEn = "Transform your living room or master bedroom into a 5-star spa sanctuary. Includes choice of massage for both partners, soothing aroma diffuser setup, and warm herbal towels.",
                DescriptionTa = "உங்கள் வீட்டின் வசதியிலேயே 5-நட்சத்திர ஸ்பா அனுபவம். இருவருக்கும் விருப்பமான மசாஜ், நறுமண டிஃப்பியூசர் மற்றும் வெதுவெதுப்பான மூலிகை துண்டுகள் அடங்கும்.",
                CategoryEn = "Special Package",
                CategoryTa = "சிறப்பு பேக்கேஜ்",
                Durations = new()
                {
                    new() { Minutes = 60, Price = 3299, OriginalPrice = 4299 },
                    new() { Minutes = 90, Price = 4499, OriginalPrice = 5699 },
                    new() { Minutes = 120, Price = 5799, OriginalPrice = 7299 }
                },
                OilsEn = "Custom Aromatherapy or Ayurvedic Oil Selection",
                OilsTa = "விருப்பமான நறுமணம் அல்லது ஆயுர்வேத எண்ணெய் தேர்வு",
                TherapistAvailable = new() { "Male & Female Team", "Female Therapists", "Male Therapists" },
                Icon = "fa-solid fa-heart",
                Popular = true
            }
        };
    }
}

using System.Text.Json.Serialization;

namespace RelaxAtHome.Frontend.Models;

public class ServiceDuration
{
    [JsonPropertyName("minutes")]
    public int Minutes { get; set; }

    [JsonPropertyName("price")]
    public int Price { get; set; }

    [JsonPropertyName("originalPrice")]
    public int OriginalPrice { get; set; }
}

public class MassageService
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name_en")]
    public string NameEn { get; set; } = string.Empty;

    [JsonPropertyName("name_ta")]
    public string NameTa { get; set; } = string.Empty;

    [JsonPropertyName("tagline_en")]
    public string TaglineEn { get; set; } = string.Empty;

    [JsonPropertyName("tagline_ta")]
    public string TaglineTa { get; set; } = string.Empty;

    [JsonPropertyName("description_en")]
    public string DescriptionEn { get; set; } = string.Empty;

    [JsonPropertyName("description_ta")]
    public string DescriptionTa { get; set; } = string.Empty;

    [JsonPropertyName("category_en")]
    public string CategoryEn { get; set; } = string.Empty;

    [JsonPropertyName("category_ta")]
    public string CategoryTa { get; set; } = string.Empty;

    [JsonPropertyName("durations")]
    public List<ServiceDuration> Durations { get; set; } = new();

    [JsonPropertyName("oils_en")]
    public string OilsEn { get; set; } = string.Empty;

    [JsonPropertyName("oils_ta")]
    public string OilsTa { get; set; } = string.Empty;

    [JsonPropertyName("therapist_available")]
    public List<string> TherapistAvailable { get; set; } = new();

    [JsonPropertyName("icon")]
    public string Icon { get; set; } = "fa-solid fa-spa";

    [JsonPropertyName("popular")]
    public bool Popular { get; set; }
}

public class LocationItem
{
    [JsonPropertyName("city")]
    public string City { get; set; } = string.Empty;

    [JsonPropertyName("areas")]
    public string Areas { get; set; } = string.Empty;
}

public class SiteConfig
{
    [JsonPropertyName("companyName")]
    public string CompanyName { get; set; } = "RelaxAtHome Doorstep Massage & Spa";

    [JsonPropertyName("companyNameTa")]
    public string CompanyNameTa { get; set; } = "ரிலாக்ஸ் அட் ஹோம் இல்ல மசாஜ் & ஸ்பா";

    [JsonPropertyName("whatsappPhone")]
    public string WhatsAppPhone { get; set; } = "919876543210";

    [JsonPropertyName("phoneDisplay")]
    public string PhoneDisplay { get; set; } = "+91 98765 43210";

    [JsonPropertyName("supportEmail")]
    public string SupportEmail { get; set; } = "booking@relaxathome.in";

    [JsonPropertyName("operatingHours")]
    public string OperatingHours { get; set; } = "8:00 AM - 10:00 PM (All 7 Days)";

    [JsonPropertyName("operatingHoursTa")]
    public string OperatingHoursTa { get; set; } = "காலை 8:00 - இரவு 10:00 (7 நாட்களும்)";

    [JsonPropertyName("serviceCities")]
    public string ServiceCities { get; set; } = "Chennai, Coimbatore, Madurai, Trichy, Bangalore";

    [JsonPropertyName("serviceCitiesTa")]
    public string ServiceCitiesTa { get; set; } = "சென்னை, கோயம்புத்தூர், மதுரை, திருச்சி, பெங்களூர்";

    [JsonPropertyName("locations")]
    public List<LocationItem> Locations { get; set; } = new();

    [JsonPropertyName("footerAboutEn")]
    public string FooterAboutEn { get; set; } = "South India's most trusted certified doorstep massage service centre. We bring 5-star spa relaxation, sanitized portable beds, and herbal aromatherapy right to your living room or hotel room.";

    [JsonPropertyName("footerAboutTa")]
    public string FooterAboutTa { get; set; } = "தென்னிந்தியாவின் நம்பகமான இல்ல மசாஜ் சேவை மையம். 5-நட்சத்திர ஸ்பா வசதிகள், சுத்திகரிக்கப்பட்ட மசாஜ் படுக்கை மற்றும் இயற்கை எண்ணெய்களுடன் உங்கள் இல்லத்திற்கே வருகிறோம்.";
}

public class BookingItem
{
    [JsonPropertyName("bookingId")]
    public string BookingId { get; set; } = string.Empty;

    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("customerPhone")]
    public string CustomerPhone { get; set; } = string.Empty;

    [JsonPropertyName("serviceName")]
    public string ServiceName { get; set; } = string.Empty;

    [JsonPropertyName("duration")]
    public int Duration { get; set; }

    [JsonPropertyName("price")]
    public object Price { get; set; } = "0";

    [JsonPropertyName("preferredDate")]
    public string PreferredDate { get; set; } = string.Empty;

    [JsonPropertyName("timeSlot")]
    public string TimeSlot { get; set; } = string.Empty;

    [JsonPropertyName("therapistPreference")]
    public string TherapistPreference { get; set; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("landmark")]
    public string Landmark { get; set; } = string.Empty;

    [JsonPropertyName("specialNotes")]
    public string SpecialNotes { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = string.Empty;
}

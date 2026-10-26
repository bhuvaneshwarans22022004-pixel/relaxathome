using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;
using RelaxAtHome.Frontend.Models;

namespace RelaxAtHome.Frontend.Pages.Admin;

public class AdminIndexModel : PageModel
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminIndexModel> _logger;

    public SiteConfig Config { get; set; } = new();
    public List<MassageService> Services { get; set; } = new();
    public List<BookingItem> Bookings { get; set; } = new();
    public string BackendApiUrl { get; set; } = "http://localhost:5000/api";
    public string StatusMessage { get; set; } = string.Empty;

    public AdminIndexModel(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<AdminIndexModel> logger)
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

            // 1. Fetch Config
            var configResp = await client.GetAsync("config");
            if (configResp.IsSuccessStatusCode)
            {
                var json = await configResp.Content.ReadAsStringAsync();
                var parsedConfig = JsonSerializer.Deserialize<SiteConfig>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (parsedConfig != null) Config = parsedConfig;
            }

            // 2. Fetch Services
            var servicesResp = await client.GetAsync("services");
            if (servicesResp.IsSuccessStatusCode)
            {
                var json = await servicesResp.Content.ReadAsStringAsync();
                var parsedServices = JsonSerializer.Deserialize<ServicesApiResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (parsedServices != null) Services = parsedServices.Services;
            }

            // 3. Fetch Bookings
            var bookingsResp = await client.GetAsync("admin/bookings");
            if (bookingsResp.IsSuccessStatusCode)
            {
                var json = await bookingsResp.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("bookings", out var bookingsElem))
                {
                    var parsedBookings = JsonSerializer.Deserialize<List<BookingItem>>(bookingsElem.GetRawText(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (parsedBookings != null) Bookings = parsedBookings;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError("Admin load error: {Message}", ex.Message);
            StatusMessage = "Backend API connection error. Changes can be saved directly when backend is reachable.";
        }
    }
}

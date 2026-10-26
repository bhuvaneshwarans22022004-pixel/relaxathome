// Load .env file before building configuration
if (File.Exists(".env"))
{
    DotNetEnv.Env.Load();
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// Configure HttpClient for communicating with Node.js backend
var backendUrl = Environment.GetEnvironmentVariable("BACKEND_API_URL") 
                 ?? builder.Configuration["AppSettings:BackendApiUrl"] 
                 ?? "http://localhost:5000/api";

if (!backendUrl.EndsWith("/"))
{
    backendUrl += "/";
}

builder.Services.AddHttpClient("NodeBackend", client =>
{
    client.BaseAddress = new Uri(backendUrl);
    client.Timeout = TimeSpan.FromSeconds(15);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

Console.WriteLine("=================================================");
Console.WriteLine("  RelaxAtHome .NET 9 Frontend Started");
Console.WriteLine($"  Backend API Target: {backendUrl}");
Console.WriteLine($"  WhatsApp Phone: {Environment.GetEnvironmentVariable("WHATSAPP_PHONE") ?? "919876543210"}");
Console.WriteLine("=================================================");

app.Run();

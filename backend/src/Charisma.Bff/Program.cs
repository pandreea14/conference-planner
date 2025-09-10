using Charisma.Bff.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Configuration.AddKeyPerFile(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "/runtime/configs", optional: true, reloadOnChange: true);
builder.Configuration.AddKeyPerFile(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "/runtime/secrets", optional: true, reloadOnChange: true);

// Configure services
builder.Services.ConfigureServices(builder.Configuration);

// Configure Serilog
builder.Host.UseSerilog(builder.Configuration);

var app = builder.Build();

// Configure the application pipeline
app.Configure();

var urls = app.Configuration["ASPNETCORE_URLS"] ?? "N/A";
Log.Information("Starting Charisma BFF web host");
Log.Information($"Bff is listening at: {urls}");
Log.Information($"Ws hub is available at: {urls}/hubs/notifications");

app.Run();

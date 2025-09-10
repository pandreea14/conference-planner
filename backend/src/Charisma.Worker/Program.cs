using Charisma.Worker.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Serilog;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddKeyPerFile(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "/runtime/configs", optional: true, reloadOnChange: true);
builder.Configuration.AddKeyPerFile(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "/runtime/secrets", optional: true, reloadOnChange: true);

builder.Services.ConfigureServices(builder.Configuration);
builder.Host.UseSerilog(builder.Configuration);
var app = builder.Build();
app.Configure();
Log.Information("Starting worker");
Log.Information($"Messaging.TopicPrefix: {builder.Configuration.GetSection("Messaging")["TopicPrefix"]}");
app.Run();
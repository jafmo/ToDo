using Microsoft.EntityFrameworkCore;
using API.Core.ToDoListDomain.DB;
using API.Core.ToDoListDomain.Service;
using API;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Register the context interface for DI
builder.Services.AddScoped<IToDoListDbContext>(static provider =>
provider.GetRequiredService<ToDoListDbContext>());
// Register application services
builder.Services.AddScoped<IToDoListService, ToDoListService>();
builder.Services.AddScoped<DataSeeder>();

// Configure in-memory EF Core database for ToDoList
builder.Services.AddDbContext<ToDoListDbContext>(static options =>
    options.UseInMemoryDatabase("ToDoList"));

builder.Services.AddCors(static options =>
{
    options.AddPolicy("AllowAngularApp",
        static policy => policy.WithOrigins("http://localhost:51559") // Your Angular dev URL
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Run data seeding if enabled in configuration (appsettings.json)
if (builder.Configuration.GetValue<bool>("SeedData"))
{
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
        // SeedData is async; wait for completion before starting the app
        await seeder.SeedData();
    }
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowAngularApp");

app.Run();

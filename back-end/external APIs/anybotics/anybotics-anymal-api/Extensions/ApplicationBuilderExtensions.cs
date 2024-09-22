using anybotics_anymal_api.Hubs;
using anybotics_anymal_api.Middlewares;
using anybotics_anymal_api.Services;

namespace anybotics_anymal_api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseCustomMiddleware(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseMiddleware<FirebaseUserMiddleware>();
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseCors("AllowLocalApps");

        // Endpoint mappings
        app.MapGrpcService<AnymalService>();
        app.MapHub<AgentsHub>("/agentsHub").RequireCors("AllowLocalApps");
        app.MapControllers();

        return app;
    }
}
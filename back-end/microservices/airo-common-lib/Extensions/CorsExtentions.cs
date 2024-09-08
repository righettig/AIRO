using Microsoft.Extensions.DependencyInjection;

namespace airo_common_lib.Extensions;

public static class CorsExtentions
{
    public static void AddCors(this IServiceCollection services, string[] corsAllowedOrigins)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalApps", policyBuilder =>
            {
                policyBuilder.WithOrigins(corsAllowedOrigins)
                             .AllowAnyHeader()
                             .AllowAnyMethod()
                             .AllowCredentials();
            });
        });
    }
}

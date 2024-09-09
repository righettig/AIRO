using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace airo_common_lib.Extensions;

public static class AuthenticationExtensions
{
    public static void AddJWTBearerAuthentication(this IServiceCollection services, string validAudience, string authority)
    {
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = authority;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = options.Authority,
                    ValidateAudience = true,
                    ValidAudience = validAudience,
                    ValidateLifetime = true
                };
            });
    }
}

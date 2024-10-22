using airo_common_lib.Time;
using Microsoft.Extensions.DependencyInjection;
using TimeProvider = airo_common_lib.Time.TimeProvider;

namespace airo_common_lib.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDefaultTimeProvider(this IServiceCollection services)
    {
        services.AddSingleton<ITimeProvider, TimeProvider>();
        return services;
    }
}

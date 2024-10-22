using Firebase.Auth;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace airo_common_lib.HealthChecks;

public class FirebaseHealthCheck(FirebaseAuthClient firebaseClient) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await firebaseClient.SignInWithEmailAndPasswordAsync("health_check@airo.com", "q1w2e3");
            if (response != null)
            {
                return HealthCheckResult.Healthy("Firebase is reachable.");
            }
            return HealthCheckResult.Unhealthy("Firebase is not reachable.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Firebase is not reachable.", ex);
        }
    }
}

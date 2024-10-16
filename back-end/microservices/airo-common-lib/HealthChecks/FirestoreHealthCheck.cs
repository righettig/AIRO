using Google.Cloud.Firestore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace airo_common_lib.HealthChecks;

public class FirestoreHealthCheck(FirestoreDb firestoreDb) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            // Perform a simple operation to check connectivity.
            var testDocument = firestoreDb.Collection("health-check").Document("test");

            await testDocument.SetAsync(new { timestamp = DateTime.UtcNow }, SetOptions.MergeAll, cancellationToken);
            await testDocument.DeleteAsync(cancellationToken: cancellationToken);

            return HealthCheckResult.Healthy("Firestore is reachable.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy($"Failed to connect to Firestore: {ex.Message}");
        }
    }
}
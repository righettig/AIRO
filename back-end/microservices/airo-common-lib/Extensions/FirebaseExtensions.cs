using FirebaseAdmin;
using Google.Cloud.Firestore;
using Microsoft.Extensions.DependencyInjection;

namespace airo_common_lib.Extensions;

public static class FirebaseExtensions
{
    public static void AddFirebaseAndFirestore(this IServiceCollection services, string credentialsPath, string firebaseProjectName)
    {
        // Set the environment variable for the credentials
        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialsPath);

        // Initialize Firebase Admin SDK
        var firebaseApp = FirebaseApp.Create();
        services.AddSingleton(firebaseApp);

        // Initialize Firestore using the service account credentials
        var firestoreDb = FirestoreDb.Create(firebaseProjectName);
        services.AddSingleton(firestoreDb);
    }
}
using Firebase.Auth;
using Firebase.Auth.Providers;
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

    public static void AddFirebaseAuthClient(this IServiceCollection services, string firebaseApiKey, string firebaseProjectName)
    {
        services.AddSingleton(new FirebaseAuthClient(new FirebaseAuthConfig
        {
            ApiKey = firebaseApiKey,
            AuthDomain = $"{firebaseProjectName}.firebaseapp.com",
            Providers = [new EmailProvider()]
        }));
    }
}
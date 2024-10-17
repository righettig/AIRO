using airo_profile_microservice.Models;
using airo_profile_microservice.Services.Interfaces;
using Google.Cloud.Firestore;

namespace airo_profile_microservice.Services.Impl;

public class FirestoreProfileRepository(FirestoreDb firestoreDb) : IProfileRepository
{
    public async Task<Profile?> GetProfile(string uid)
    {
        var docRef = firestoreDb.Collection("profiles").Document(uid);
        var snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists ? snapshot.ConvertTo<Profile>() : null;
    }

    public Task SetProfile(string uid, Dictionary<string, object> profile)
    {
        var docRef = firestoreDb.Collection("profiles").Document(uid);
        return docRef.SetAsync(profile);
    }
}

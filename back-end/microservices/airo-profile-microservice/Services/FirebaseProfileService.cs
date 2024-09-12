using airo_profile_microservice.Models;
using Google.Cloud.Firestore;

namespace airo_profile_microservice.Services;

public class FirebaseProfileService : IProfileService
{
    private readonly FirestoreDb _firestoreDb;

    public FirebaseProfileService(FirestoreDb firestoreDb)
    {
        _firestoreDb = firestoreDb;
    }

    public async Task CreateProfile(string uid, string accountType, string email, string? creditCardDetails)
    {
        var docRef = _firestoreDb.Collection("profiles").Document(uid);

        var data = new Dictionary<string, object>
        {
            { "uid", uid },
            { "firstName", "" },
            { "lastName", "" },
            { "accountType", accountType },
            { "email", email },
            { "creditCardDetails", creditCardDetails },
        };

        await docRef.SetAsync(data);
    }

    public async Task<Profile?> GetByUid(string uid)
    {
        var docRef = _firestoreDb.Collection("profiles").Document(uid);
        var snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists ? snapshot.ConvertTo<Profile>() : null;
    }
}

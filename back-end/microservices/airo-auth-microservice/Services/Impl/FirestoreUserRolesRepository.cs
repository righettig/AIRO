using airo_auth_microservice.Services.Interfaces;
using Google.Cloud.Firestore;

namespace airo_auth_microservice.Services.Impl;

public class FirestoreUserRolesRepository(FirestoreDb firestoreDb) : IUserRolesRepository
{
    public async Task<string?> GetRole(string email)
    {
        var docRef = firestoreDb.Collection("userRoles").Document(email);
        var snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists ? snapshot.GetValue<string>("role") : null;
    }

    public Task SetRole(string email, string role)
    {
        var docRef = firestoreDb.Collection("userRoles").Document(email);

        var data = new Dictionary<string, object>
        {
            { "role", role }
        };

        return docRef.SetAsync(data);
    }
}

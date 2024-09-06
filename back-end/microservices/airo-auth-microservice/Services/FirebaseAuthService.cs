using Firebase.Auth;
using Google.Cloud.Firestore;

namespace airo_auth_microservice.Services;

public class FirebaseAuthService : IFirebaseAuthService
{
    private readonly FirebaseAuthClient _firebaseAuth;
    private readonly FirestoreDb _firestoreDb;

    public FirebaseAuthService(FirebaseAuthClient firebaseAuth, FirestoreDb firestoreDb)
    {
        _firebaseAuth = firebaseAuth;
        _firestoreDb = firestoreDb;
    }

    public async Task<string?> SignUp(string email, string password)
    {
        var userCredentials = await _firebaseAuth.CreateUserWithEmailAndPasswordAsync(email, password);
        return userCredentials is null ? null : await userCredentials.User.GetIdTokenAsync();
    }

    public async Task<string?> Login(string email, string password)
    {
        var userCredentials = await _firebaseAuth.SignInWithEmailAndPasswordAsync(email, password);
        return userCredentials is null ? null : await userCredentials.User.GetIdTokenAsync();
    }

    public async Task<string?> RefreshToken()
    {
        var newToken = await _firebaseAuth.User.GetIdTokenAsync(forceRefresh: true);
        return newToken;
    }

    public void SignOut() => _firebaseAuth.SignOut();

    public async Task<string> GetUserRole(string email)
    {
        var docRef = _firestoreDb.Collection("userRoles").Document(email);
        var snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists ? snapshot.GetValue<string>("role") : null;
    }
}

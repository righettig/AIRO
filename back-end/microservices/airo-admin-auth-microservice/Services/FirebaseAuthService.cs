using airo_admin_auth_microservice.Models;
using Firebase.Auth;
using Google.Cloud.Firestore;

namespace airo_admin_auth_microservice.Services;

public class FirebaseAuthService : IAuthService
{
    private readonly FirebaseAuthClient _firebaseAuth;
    private readonly FirestoreDb _firestoreDb;

    public FirebaseAuthService(FirebaseAuthClient firebaseAuth, FirestoreDb firestoreDb)
    {
        _firebaseAuth = firebaseAuth;
        _firestoreDb = firestoreDb;
    }

    public async Task<LoginResponse?> Login(string email, string password)
    {
        var userCredentials = await _firebaseAuth.SignInWithEmailAndPasswordAsync(email, password);

        if (userCredentials is null)
        {
            return null;
        }

        var result = new LoginResponse(userCredentials.User.Uid, await userCredentials.User.GetIdTokenAsync());

        return result;
    }

    public async Task<string?> RefreshToken()
    {
        var newToken = await _firebaseAuth.User.GetIdTokenAsync(forceRefresh: true);
        return newToken;
    }

    public void SignOut() => _firebaseAuth.SignOut();
}

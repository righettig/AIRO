using airo_auth_microservice.DTOs;
using Firebase.Auth;
using Google.Cloud.Firestore;

namespace airo_auth_microservice.Services;

public class FirebaseAuthService : IAuthService
{
    private readonly IFirebaseAuthClient _firebaseAuth;
    private readonly FirestoreDb _firestoreDb;

    public FirebaseAuthService(IFirebaseAuthClient firebaseAuth, FirestoreDb firestoreDb)
    {
        _firebaseAuth = firebaseAuth;
        _firestoreDb = firestoreDb;
    }

    public async Task<SignupResponse?> SignUp(string email, string password)
    {
        var userCredentials = await _firebaseAuth.CreateUserWithEmailAndPasswordAsync(email, password);

        var docRef = _firestoreDb.Collection("userRoles").Document(email);

        var data = new Dictionary<string, object>
        {
            { "role", "standard" }
        };

        await docRef.SetAsync(data);

        if (userCredentials is null) {
            return null;
        }

        var result = new SignupResponse(userCredentials.User.Uid, await userCredentials.User.GetIdTokenAsync());     
        
        return result;
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

    public async Task<string> GetUserRole(string email)
    {
        var docRef = _firestoreDb.Collection("userRoles").Document(email);
        var snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists ? snapshot.GetValue<string>("role") : null;
    }
}

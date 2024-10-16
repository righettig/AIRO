using airo_admin_auth_microservice.Models;
using Firebase.Auth;

namespace airo_admin_auth_microservice.Services;

public class FirebaseAuthService(FirebaseAuthClient firebaseAuth) : IAuthService
{
    private readonly FirebaseAuthClient _firebaseAuth = firebaseAuth;

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

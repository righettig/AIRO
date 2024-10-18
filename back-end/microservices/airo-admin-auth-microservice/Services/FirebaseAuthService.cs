using airo_admin_auth_microservice.DTOs;
using Firebase.Auth;

namespace airo_admin_auth_microservice.Services;

public class FirebaseAuthService(IFirebaseAuthClient firebaseAuth) : IAuthService
{
    public async Task<LoginResponse?> Login(string email, string password)
    {
        var userCredentials = await firebaseAuth.SignInWithEmailAndPasswordAsync(email, password);

        if (userCredentials is null)
        {
            return null;
        }

        var result = new LoginResponse(userCredentials.User.Uid, await userCredentials.User.GetIdTokenAsync());

        return result;
    }

    public async Task<string?> RefreshToken()
    {
        var newToken = await firebaseAuth.User.GetIdTokenAsync(forceRefresh: true);
        return newToken;
    }

    public void SignOut() => firebaseAuth.SignOut();
}

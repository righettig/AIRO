using airo_auth_microservice.DTOs;
using airo_auth_microservice.Services.Interfaces;
using Firebase.Auth;

namespace airo_auth_microservice.Services.Impl;

public class FirebaseAuthService(IFirebaseAuthClient firebaseAuth, IUserRolesRepository rolesRepository) : IAuthService
{
    public async Task<SignupResponse?> SignUp(string email, string password)
    {
        var userCredentials = await firebaseAuth.CreateUserWithEmailAndPasswordAsync(email, password);

        if (userCredentials is null)
        {
            return null;
        }

        await rolesRepository.SetRole(email, "standard");

        var result = new SignupResponse(userCredentials.User.Uid, await userCredentials.User.GetIdTokenAsync());

        return result;
    }

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

    public Task<string> GetUserRole(string email) => rolesRepository.GetRole(email);
}

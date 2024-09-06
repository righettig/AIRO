namespace airo_auth_microservice.Services;

public interface IFirebaseAuthService
{
    Task<string> GetUserRole(string email);
    Task<string?> Login(string email, string password);
    void SignOut();
    Task<string?> SignUp(string email, string password);
    Task<string?> RefreshToken();
}
using airo_admin_auth_microservice.DTOs;

namespace airo_admin_auth_microservice.Services;

public interface IAuthService
{
    Task<LoginResponse?> Login(string email, string password);
    void SignOut();
    Task<string?> RefreshToken();
}
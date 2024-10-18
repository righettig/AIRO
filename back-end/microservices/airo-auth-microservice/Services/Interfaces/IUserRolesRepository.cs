namespace airo_auth_microservice.Services.Interfaces;

public interface IUserRolesRepository
{
    Task<string?> GetRole(string email);
    Task SetRole(string email, string role);
}

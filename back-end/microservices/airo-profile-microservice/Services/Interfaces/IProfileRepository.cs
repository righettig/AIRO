using airo_profile_microservice.Models;

namespace airo_profile_microservice.Services.Interfaces;

public interface IProfileRepository
{
    Task<Profile?> GetProfile(string uid);
    Task SetProfile(string uid, Dictionary<string, object> profile);
}

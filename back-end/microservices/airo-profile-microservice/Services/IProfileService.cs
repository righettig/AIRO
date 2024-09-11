using airo_profile_microservice.Models;

namespace airo_profile_microservice.Services;

public interface IProfileService
{
    Task CreateProfile(string uid, string accountType, string emaill, string? creditCardDetails);
    Task<Profile?> GetByUid(string uid);
}
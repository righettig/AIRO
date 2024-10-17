using airo_profile_microservice.Models;

namespace airo_profile_microservice.Services.Interfaces;

public interface IProfileService
{
    Task CreateProfile(string uid, string accountType, string emaill, string? creditCardDetails);
    Task UpdateProfile(string uid, string firstName, string lastName);
    Task<Profile?> GetByUid(string uid);
}
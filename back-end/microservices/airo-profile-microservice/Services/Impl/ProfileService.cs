using airo_profile_microservice.Models;
using airo_profile_microservice.Services.Interfaces;

namespace airo_profile_microservice.Services.Impl;

public class ProfileService(IProfileRepository profileRepository) : IProfileService
{
    public async Task CreateProfile(string uid, string accountType, string email, string? creditCardDetails)
    {
        await profileRepository.SetProfile(uid, new Dictionary<string, object>
        {
            { "uid", uid },
            { "firstName", "" },
            { "lastName", "" },
            { "accountType", accountType },
            { "email", email },
            { "creditCardDetails", creditCardDetails ?? ""},
        });
    }

    public async Task UpdateProfile(string uid, string firstName, string lastName)
    {
        await profileRepository.SetProfile(uid, new Dictionary<string, object>
        {
            { "firstName", firstName },
            { "lastName", lastName }
        });
    }

    public Task<Profile?> GetByUid(string uid) => profileRepository.GetProfile(uid);
}

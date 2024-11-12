using System.Net.Http.Json;
using airo_event_simulation_infrastructure.Interfaces;

namespace airo_event_simulation_infrastructure.Impl;

public record GetNicknameByUidResponse(string Nickname);

public class ProfileService(HttpClient httpClient) : IProfileService
{
    public async Task<string> GetNicknameByUid(string userId)
    {
        var response = await httpClient.GetFromJsonAsync<GetNicknameByUidResponse>($"profile?uid={userId}");

        if (response is null)
        {
            throw new Exception($"Failed to retrieve nickname for user: {userId}");
        }

        return response.Nickname;
    }
}
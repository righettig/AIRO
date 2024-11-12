namespace airo_event_simulation_infrastructure.Interfaces;

public interface IProfileService
{
    Task<string> GetNicknameByUid(string userId);
}
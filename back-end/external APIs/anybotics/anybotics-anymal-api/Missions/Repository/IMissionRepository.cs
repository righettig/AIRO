using anybotics_anymal_api.Missions.Models;

namespace anybotics_anymal_api.Missions.Repository;

public interface IMissionRepository
{
    Task<IEnumerable<Mission>> GetMissionsAsync();
    Task<Mission> GetMissionByIdAsync(string id);
    Task AddMissionAsync(Mission mission);
    Task DeleteMissionAsync(string id);
}

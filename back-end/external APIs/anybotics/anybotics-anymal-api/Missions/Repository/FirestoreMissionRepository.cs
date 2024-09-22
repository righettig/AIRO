using anybotics_anymal_api.Missions.Models;
using Google.Cloud.Firestore;

namespace anybotics_anymal_api.Missions.Repository;

public class FirestoreMissionRepository(FirestoreDb firestoreDb) : IMissionRepository
{
    public async Task<IEnumerable<Mission>> GetMissionsAsync()
    {
        var missions = new List<Mission>();
        var querySnapshot = await firestoreDb.Collection("missions").GetSnapshotAsync();
        foreach (var documentSnapshot in querySnapshot.Documents)
        {
            var mission = documentSnapshot.ConvertTo<Mission>();
            mission.Id = documentSnapshot.Id;
            missions.Add(mission);
        }
        return missions;
    }

    public async Task<Mission> GetMissionByIdAsync(string id)
    {
        var documentSnapshot = await firestoreDb.Collection("missions").Document(id).GetSnapshotAsync();
        if (documentSnapshot.Exists)
        {
            var mission = documentSnapshot.ConvertTo<Mission>();
            mission.Id = documentSnapshot.Id;
            return mission;
        }
        return null;
    }

    public async Task AddMissionAsync(Mission mission)
    {
        await firestoreDb.Collection("missions").AddAsync(mission);
    }

    public async Task DeleteMissionAsync(string id)
    {
        await firestoreDb.Collection("missions").Document(id).DeleteAsync();
    }
}
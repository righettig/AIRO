namespace anybotics_anymal_api.Missions.Models;

public class Mission
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<string> Commands { get; set; } // List of command names
}

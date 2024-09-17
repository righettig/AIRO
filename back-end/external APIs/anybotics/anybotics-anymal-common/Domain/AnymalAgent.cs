using AnymalGrpc;

namespace anybotics_anymal_common.Domain;

public class AnymalAgent(string id, string name)
{
    public string Id { get; set; } = id;
    public string Name { get; set; } = name;
    public int BatteryLevel { get; set; } = 100;
    public Status Status { get; set; } = Status.Active;
    public GeneralInfo General { get; set; } = new GeneralInfo();
    public HardwareInfo Hardware { get; set; } = new HardwareInfo();
    public List<string> RecentImages { get; set; } = 
    [
        "https://placehold.co/400?text=Room\\n1",
        "https://placehold.co/400?text=Room\\n2",
        "https://placehold.co/400?text=Room\\n3",
        "https://placehold.co/400?text=Room\\n4",
        "https://placehold.co/400?text=Room\\n5"
    ];
}

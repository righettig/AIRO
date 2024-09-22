namespace anybotics_anymal_common.Domain;

public class GeneralInfo
{
    public string Model { get; set; }
    public string FirmwareVersion { get; set; }
    public DateTime FirmwareLastUpdated { get; set; }
    public bool ManualModeOn { get; set; }
    public Location Location { get; set; }
    public string TrekkerVersion { get; set; }
    public DateTime TrekkerLastUpdated { get; set; }

    public GeneralInfo()
    {
        Model = "ANYmal X";
        FirmwareVersion = "1.0.0";
        FirmwareLastUpdated = new DateTime(2024, 7, 15, 12, 0, 0, DateTimeKind.Utc);
        ManualModeOn = false;
        Location = new Location
        {
            X = 0,
            Y = 0.65,
            Z = 0
        };
        TrekkerVersion = "1.0.0";
        TrekkerLastUpdated = new DateTime(2024, 7, 14, 15, 0, 0, DateTimeKind.Utc);
    }
}

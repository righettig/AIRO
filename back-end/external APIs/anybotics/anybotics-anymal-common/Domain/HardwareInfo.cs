namespace anybotics_anymal_common.Domain;

public class HardwareInfo
{
    public string TemperatureSensor { get; set; }
    public string PressureSensor { get; set; }
    public string Leg1Status { get; set; }
    public string Leg2Status { get; set; }
    public string Leg3Status { get; set; }
    public string Leg4Status { get; set; }
    public string Gps { get; set; }
    public string Engine { get; set; }
    public string Battery { get; set; }
    public string LidarScanner { get; set; }
    public string Wifi { get; set; }
    public string Lte { get; set; }
    public string Cpu1 { get; set; }
    public string Cpu2 { get; set; }
    public List<string> DepthCameras { get; set; }
    public List<string> OpticalCameras { get; set; }
    public string ThermalCamera { get; set; }
    public string PanTiltUnit { get; set; }
    public string Spotlight { get; set; }
    public string UltrasonicMicrophone { get; set; }

    public HardwareInfo()
    {
        TemperatureSensor = HardwareStatus.Running;
        PressureSensor = HardwareStatus.Running;
        Leg1Status = HardwareStatus.Running;
        Leg2Status = HardwareStatus.Running;
        Leg3Status = HardwareStatus.Running;
        Leg4Status = HardwareStatus.Running;
        Gps = HardwareStatus.Running;
        Engine = HardwareStatus.Running;
        Battery = HardwareStatus.Running;
        LidarScanner = HardwareStatus.Running;
        Wifi = HardwareStatus.Running;
        Lte = HardwareStatus.Running;
        Cpu1 = HardwareStatus.Running;
        Cpu2 = HardwareStatus.Running;
        DepthCameras =
        [
            HardwareStatus.Running,
            HardwareStatus.Running,
            HardwareStatus.Running,
            HardwareStatus.Running,
            HardwareStatus.Running,
            HardwareStatus.Running
        ];
        OpticalCameras =
        [
            HardwareStatus.Running,
            HardwareStatus.Running
        ];
        ThermalCamera = HardwareStatus.Running;
        PanTiltUnit = HardwareStatus.Running;
        Spotlight = HardwareStatus.Running;
        UltrasonicMicrophone = HardwareStatus.Running;
    }
}

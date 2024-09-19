using anybotics_anymal;
using anybotics_anymal_common.Domain;
using AnymalGrpc;
using Grpc.Core;
using Grpc.Net.Client;
using System.Net.Security;
using System.Reflection;

class Program
{
    static async Task Main(string[] args)
    {
        // Parse the agent name from the command-line arguments
        string agentName = args.Length > 0 ? args[0] : "Anymal";

        // Create a channel to the gRPC server
        using var channel = GrpcChannel.ForAddress("http://localhost:4008", new GrpcChannelOptions
        {
            // This is required when trying to connect from host machine to a GRPC server running inside a docker container
            HttpHandler = new SocketsHttpHandler
            {
                // Disable SSL certificate validation if needed
                SslOptions = new SslClientAuthenticationOptions
                {
                    RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
                }
            }
        });

        var client = new AnymalService.AnymalServiceClient(channel);

        var agentId = Guid.NewGuid().ToString();

        var agent = new AnymalAgent(agentId, agentName);

        try
        {
            // Register the agent
            await RegisterAgentAsync(client, agentId, agentName);

            // Start monitoring events
            _ = MonitorCommandsAsync(client, agent);
            _ = ReportHardwareFailuresAsync(client, agent);
            _ = ReportInspectionEventsAsync(client, agent);

            // Start battery decrease loop
            await BatteryDecreaseLoopAsync(client, agent);
        }
        catch (RpcException ex) when (ex.StatusCode == StatusCode.Unavailable)
        {
            Console.WriteLine($"Error: Server is unavailable.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
        }
        finally
        {
            await channel.ShutdownAsync();
        }
    }

    static async Task RegisterAgentAsync(AnymalService.AnymalServiceClient client, string agentId, string agentName)
    {
        var request = new RegistrationRequest { Id = agentId, Name = agentName };
        var registrationResponse = await client.RegisterAgentAsync(request);
        Console.WriteLine($"Registration: {registrationResponse.Message} (ID: {request.Id})");
    }

    static async Task MonitorCommandsAsync(AnymalService.AnymalServiceClient client, AnymalAgent agent)
    {
        var commandProcessors = CommandProcessorDiscovery.DiscoverCommandProcessors();

        using var call = client.StreamCommands(new CommandListener { Id = agent.Id });

        await foreach (var response in call.ResponseStream.ReadAllAsync())
        {
            if (response.Id == agent.Id && commandProcessors.TryGetValue(response.CommandId, out var processor))
            {
                if (processor.ConditionCheck(agent))
                {
                    processor.PerformCommand(agent, response);
                }
            }
        }
    }

    static async Task BatteryDecreaseLoopAsync(AnymalService.AnymalServiceClient client, AnymalAgent agent)
    {
        while (agent.BatteryLevel > 0)
        {
            await Task.Delay(10 * 1000); // 10 seconds delay

            if (agent.Status == AnymalGrpc.Status.Active)
            {
                agent.BatteryLevel--;

                var updateResponse = await client.UpdateBatteryAsync(new BatteryUpdate
                {
                    Id = agent.Id,
                    BatteryLevel = agent.BatteryLevel
                });

                Console.WriteLine($"Battery Update: {updateResponse.Message}");
            }
        }

        await NotifyBatteryDepletionAsync(client, agent);
    }

    static async Task NotifyBatteryDepletionAsync(AnymalService.AnymalServiceClient client, AnymalAgent agent)
    {
        // Final battery update when battery reaches 0
        var finalUpdateResponse = await client.UpdateBatteryAsync(new BatteryUpdate
        {
            Id = agent.Id,
            BatteryLevel = agent.BatteryLevel
        });

        Console.WriteLine($"Final Battery Update: {finalUpdateResponse.Message}");

        // Update status to Unavailable and notify the server
        agent.Status = AnymalGrpc.Status.Unavailable;

        var statusUpdateResponse = await client.UpdateStatusAsync(new StatusUpdate
        {
            Id = agent.Id,
            Status = agent.Status
        });

        Console.WriteLine($"Status Update: {statusUpdateResponse.Message}");
    }

    static async Task ReportHardwareFailuresAsync(AnymalService.AnymalServiceClient client, AnymalAgent agent)
    {
        var hardwareItems = new List<string>
        {
            "TemperatureSensor",
            "PressureSensor",
            "Leg1Status",
            "Leg2Status",
            "Leg3Status",
            "Leg4Status",
            "Gps",
            "Engine",
            "Battery",
            "LidarScanner",
            "Wifi",
            "Lte",
            "Cpu1",
            "Cpu2",
            "DepthCameras",
            "OpticalCameras",
            "ThermalCamera",
            "PanTiltUnit",
            "Spotlight",
            "UltrasonicMicrophone"
        };

        var failureTypes = typeof(HardwareStatus).GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
                                                 .Where(fi => fi.IsLiteral && !fi.IsInitOnly && fi.FieldType == typeof(string))
                                                 .Select(fi => (string)fi.GetRawConstantValue())
                                                 .ToList();

        Random rand = new();

        while (true)
        {
            await Task.Delay(rand.Next(15, 30) * 1000); // Random delay between 15-30 seconds

            string hardwareItem = hardwareItems[rand.Next(hardwareItems.Count)];
            string failureType = failureTypes[rand.Next(failureTypes.Count)];

            // Using reflection to set hardware status
            var propertyInfo = typeof(HardwareInfo).GetProperty(hardwareItem);
            if (propertyInfo != null)
            {
                if (propertyInfo.PropertyType == typeof(string))
                {
                    propertyInfo.SetValue(agent.Hardware, failureType);
                }
                else if (propertyInfo.PropertyType == typeof(List<string>))
                {
                    var list = propertyInfo.GetValue(agent.Hardware) as List<string>;
                    for (int i = 0; i < list.Count; i++)
                    {
                        list[i] = failureType;
                    }
                }
            }

            var hardwareFailure = new HardwareFailure
            {
                Id = agent.Id,
                HardwareItem = hardwareItem,
                FailureType = failureType
            };

            var response = await client.ReportHardwareFailureAsync(hardwareFailure);
            Console.WriteLine($"Reported Hardware Failure: {hardwareFailure.HardwareItem} {hardwareFailure.FailureType}");
        }
    }

    static async Task ReportInspectionEventsAsync(AnymalService.AnymalServiceClient client, AnymalAgent agent)
    {
        var rooms = new List<string> { "Room1", "Room2", "Room3" };
        var equipmentIds = new List<string> { "Equip1", "Equip2", "Equip3" };
        var anomalyTypes = new List<string> { "Thermal", "Acoustic", "Gas" };

        Random rand = new();

        while (true)
        {
            await Task.Delay(rand.Next(20, 40) * 1000); // Random delay between 20-40 seconds
            string anomalyType = anomalyTypes[rand.Next(anomalyTypes.Count)];

            var anomalyReport = new AnomalyReport
            {
                Id = agent.Id,
                AnomalyType = anomalyType,
                Room = rooms[rand.Next(rooms.Count)],
                EquipmentId = equipmentIds[rand.Next(equipmentIds.Count)]
            };

            var response = await client.ReportAnomalyAsync(anomalyReport);
            Console.WriteLine($"{anomalyType} Anomaly: {response.Message} ({anomalyReport.Room}, {anomalyReport.EquipmentId})");
        }
    }
}

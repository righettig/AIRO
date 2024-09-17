using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.Missions.Controllers;
using anybotics_anymal_api.Missions.Models;
using anybotics_anymal_api.Missions.Repository;
using AnymalGrpc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace anybotics_unit_tests.Controllers;

public class MissionsControllerTests
{
    private readonly Mock<IMissionRepository> _mockMissionRepository;
    private readonly Mock<ICommandBus> _mockCommandBus;
    private readonly Mock<HttpContext> _mockHttpContext;

    private readonly MissionsController _controller;

    public MissionsControllerTests()
    {
        _mockMissionRepository = new Mock<IMissionRepository>();
        _mockCommandBus = new Mock<ICommandBus>();
        _controller = new MissionsController(_mockMissionRepository.Object, _mockCommandBus.Object);

        _mockHttpContext = new Mock<HttpContext>();

        _controller = new MissionsController(_mockMissionRepository.Object, _mockCommandBus.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = _mockHttpContext.Object
            }
        };
    }

    [Fact]
    public async Task GetMissions_ShouldReturnOkWithMissions()
    {
        // Arrange
        var missions = new List<Mission>
        {
            new Mission { Id = "mission1", Name = "Mission One" },
            new Mission { Id = "mission2", Name = "Mission Two" }
        };

        _mockMissionRepository.Setup(repo => repo.GetMissionsAsync())
            .ReturnsAsync(missions);

        // Act
        var result = await _controller.GetMissions();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedMissions = Assert.IsType<List<Mission>>(okResult.Value);
        Assert.Equal(2, returnedMissions.Count);
    }

    [Fact]
    public async Task CreateMission_ShouldReturnOkWithMission()
    {
        // Arrange
        var mission = new Mission { Name = "New Mission" };
        var createdMission = new Mission { Id = "newId", Name = "New Mission" };

        _mockMissionRepository.Setup(repo => repo.AddMissionAsync(mission))
            .Returns(Task.CompletedTask);
        _mockMissionRepository.Setup(repo => repo.AddMissionAsync(It.IsAny<Mission>()))
            .Callback(() => mission.Id = createdMission.Id);

        // Act
        var result = await _controller.CreateMission(mission);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedMission = Assert.IsType<Mission>(okResult.Value);
        Assert.Equal(createdMission.Id, returnedMission.Id);
    }

    [Fact]
    public async Task DeleteMission_ShouldReturnOk()
    {
        // Arrange
        var missionId = "missionId";

        _mockMissionRepository.Setup(repo => repo.DeleteMissionAsync(missionId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeleteMission(missionId);

        // Assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task ExecuteMission_ShouldReturnOkWhenCommandsExecuted()
    {
        // Arrange
        var mission = new Mission
        {
            Commands = ["MoveLeftCommand", "AcousticMeasureCommand"]
        };

        var mockUserUid = "test-user-uid";
        
        _mockHttpContext.Setup(ctx => ctx.Items["UserUid"]).Returns(mockUserUid);

        _mockMissionRepository.Setup(repo => repo.GetMissionByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(mission);

        _mockCommandBus.Setup(bus => bus.SendAsync(It.IsAny<ICommand>()))
            .Returns(Task.FromResult(new UpdateResponse()));

        // Act
        var result = await _controller.ExecuteMission(new ExecuteMissionRequest { MissionId = "missionId", AgentId = "agentId" });

        // Assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task ExecuteMission_ShouldReturnNotFoundWhenMissionNotFound()
    {
        // Arrange
        _mockMissionRepository.Setup(repo => repo.GetMissionByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Mission)null);

        // Act
        var result = await _controller.ExecuteMission(new ExecuteMissionRequest { MissionId = "nonexistentId", AgentId = "agentId" });

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.Equal("Mission not found", notFoundResult.Value);
    }
}

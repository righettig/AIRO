using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_tests.Common;
using Moq;

namespace airo_event_simulation_tests;

public class SimulationStateTests
{
    [Fact]
    public void Constructor_ShouldInitializeProperties()
    {
        // Arrange
        int currentTurn = 1;

        // Act
        var simulationState = new SimulationState(currentTurn);

        // Assert
        Assert.Equal(currentTurn, simulationState.CurrentTurn);
        Assert.Null(simulationState.Participants);
        Assert.Null(simulationState.Tiles);
    }

    [Fact]
    public void GetTileAt_ShouldReturnCorrectTile()
    {
        // Arrange
        var map = TestMap.Get();
        var simulationState = new SimulationState(1);
        simulationState.InitializeSimulation([], map);

        // Act
        var tile = simulationState.GetTileAt(new Position(1, 1));

        // Assert
        Assert.Equal(TileType.Wood, tile.Type);
    }

    [Fact]
    public void GetVisibleTiles_ShouldReturnCorrectTiles()
    {
        // Arrange
        var map = TestMap.Get();
        var simulationState = new SimulationState(1);
        simulationState.InitializeSimulation([], map);
        var position = new Position(1, 1);
        int radius = 1;

        // Act
        var visibleTiles = simulationState.GetVisibleTiles(position, radius);

        // Assert
        Assert.Equal(9, visibleTiles.Count); // 3x3 square around position (1, 1)
        Assert.Contains(new Position(0, 0), visibleTiles);
        Assert.Contains(new Position(1, 1), visibleTiles);
        Assert.Contains(new Position(2, 2), visibleTiles);
    }

    [Fact]
    public void InitializeSimulation_ShouldSetParticipantsAndMap()
    {
        // Arrange
        var map = TestMap.Get();
        var participants = new List<Participant>
        {
            new(UserId: "user1", new Bot(Guid.NewGuid(), 100, new Mock<IBotAgent>().Object))
        };
        var simulationState = new SimulationState(1);

        // Act
        simulationState.InitializeSimulation([.. participants], map);

        // Assert
        Assert.Equal(participants, simulationState.Participants);
        Assert.NotNull(simulationState.Tiles);
        Assert.Equal(TileType.Bot, simulationState.Tiles[0, 0].Type); // Ensure map is set
        Assert.Equal(participants[0].Bot.Position, new Position(0, 0));
    }
}

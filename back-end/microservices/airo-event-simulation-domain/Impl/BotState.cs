﻿using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class BotState(Guid botId,
                      int health,
                      int attack,
                      int defense,
                      Position position, 
                      Dictionary<Position, ITileInfo> visibleTiles) : IBotState
{
    public Guid Id => botId;
    public int Health => health;
    public int Attack => attack;
    public int Defense => defense;

    public Position Position => position;

    public Dictionary<Position, ITileInfo> VisibleTiles => visibleTiles;

    public ISimulationBot? GetNearestOpponentBot()
    {
        ISimulationBot? nearestBot = null;
        int minDistance = int.MaxValue;

        foreach (var kvp in VisibleTiles)
        {
            if (kvp.Value.Type == TileType.Bot && kvp.Key != Position) // Use the current bot's position
            {
                int distance = GetDistance(Position, kvp.Key); // Use Position directly from state
                if (distance < minDistance)
                {
                    minDistance = distance;
                    nearestBot = kvp.Value.Bot;
                }
            }
        }
        return nearestBot;
    }

    public Position? GetNearestFoodTile()
    {
        Position? nearestFood = null;
        int minDistance = int.MaxValue;

        foreach (var kvp in VisibleTiles)
        {
            if (kvp.Value.Type == TileType.Food)
            {
                int distance = GetDistance(Position, kvp.Key); // Use Position directly from state
                if (distance < minDistance)
                {
                    minDistance = distance;
                    nearestFood = kvp.Key;
                }
            }
        }
        return nearestFood;
    }

    public bool CanAttack(ISimulationBot? bot)
    {
        if (bot is null) return false;

        var distance = GetAbsoluteDistance(Position, bot.Position); // Use Position directly from state
        return distance < 2; // It's only possible to attack enemies that are either directly (1) or diagonally (1.41~) adjacent
    }

    public bool CanMove(Direction direction)
    {
        var newPosition = GetNewPosition(Position, direction);
        return IsValidPosition(newPosition, VisibleTiles);
    }

    private static Position GetNewPosition(Position oldPosition, Direction direction)
    {
        return direction switch
        {
            Direction.Up => new Position(oldPosition.X, oldPosition.Y - 1),
            Direction.Down => new Position(oldPosition.X, oldPosition.Y + 1),
            Direction.Left => new Position(oldPosition.X - 1, oldPosition.Y),
            Direction.Right => new Position(oldPosition.X + 1, oldPosition.Y),
            _ => oldPosition // No movement
        };
    }

    private static bool IsValidPosition(Position position, Dictionary<Position, ITileInfo> visibleTiles)
    {
        // Check that the bot can move on a tile and bot is not trying to move outside of map boundaries
        if (visibleTiles.TryGetValue(position, out ITileInfo? value))
        {
            return value.Type.CanMoveOn();
        }

        return false;        
    }

    private static int GetDistance(Position pos1, Position pos2)
    {
        return Math.Abs(pos1.X - pos2.X) + Math.Abs(pos1.Y - pos2.Y); // Manhattan distance
    }

    private static double GetAbsoluteDistance(Position pos1, Position pos2)
    {
        return Math.Sqrt((pos1.X - pos2.X) * (pos1.X - pos2.X) + (pos1.Y - pos2.Y) * (pos1.Y - pos2.Y));
    }
}
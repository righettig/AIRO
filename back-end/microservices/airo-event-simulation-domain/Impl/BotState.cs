using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class BotState(Guid botId,
                      int health,
                      Position position, 
                      Dictionary<Position, TileInfo> visibleTiles) : IBotState
{
    public Guid Id => botId;
    public int Health => health;

    public Position Position => position;

    public Dictionary<Position, TileInfo> VisibleTiles => visibleTiles;

    public Position GetNearestFoodTile()
    {
        throw new NotImplementedException();
    }

    public Bot GetNearestOpponentBot()
    {
        throw new NotImplementedException();
    }

    public IEnumerable<(Position, TileInfo)> TraverseVisibleTiles()
    {
        throw new NotImplementedException();
    }

    //    public IEnumerable<KeyValuePair<Position, TileInfo>> TraverseVisibleTiles()
//    {
//        return VisibleTiles;
//    }

//    public Bot GetNearestOpponentBot()
//    {
//        Bot nearestBot = null;
//        int minDistance = int.MaxValue;

//        foreach (var kvp in VisibleTiles)
//        {
//            if (kvp.Value.Type == TileType.Bot && kvp.Key != Position) // Use the current bot's position
//            {
//                int distance = GetDistance(Position, kvp.Key); // Use Position directly from state
//                if (distance < minDistance)
//                {
//                    minDistance = distance;
//                    nearestBot = kvp.Value.Bot;
//                }
//            }
//        }
//        return nearestBot;
//    }

//    public Position GetNearestFoodTile()
//    {
//        Position nearestFood = null;
//        int minDistance = int.MaxValue;

//        foreach (var kvp in VisibleTiles)
//        {
//            if (kvp.Value.Type == TileType.Food)
//            {
//                int distance = GetDistance(Position, kvp.Key); // Use Position directly from state
//                if (distance < minDistance)
//                {
//                    minDistance = distance;
//                    nearestFood = kvp.Key;
//                }
//            }
//        }
//        return nearestFood;
//    }

//    private int GetDistance(Position pos1, Position pos2)
//    {
//        return Math.Abs(pos1.X - pos2.X) + Math.Abs(pos1.Y - pos2.Y); // Manhattan distance
//    }
}
namespace airo_event_simulation_domain.Impl.Simulation;

public record Position(int X, int Y)
{
    public Position(Position p)
    {
        X = p.X;
        Y = p.Y;
    }
}

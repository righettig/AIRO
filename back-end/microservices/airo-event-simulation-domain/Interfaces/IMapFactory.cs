using airo_event_simulation_domain.Impl;

namespace airo_event_simulation_domain.Interfaces
{
    public interface IMapFactory
    {
        Map FromString(string mapString);
    }
}

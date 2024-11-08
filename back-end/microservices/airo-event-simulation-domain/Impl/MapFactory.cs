using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl
{
    public class MapFactory : IMapFactory
    {
        public Map FromString(string mapString)
        {
            return new Map(mapString);
        }
    }
}

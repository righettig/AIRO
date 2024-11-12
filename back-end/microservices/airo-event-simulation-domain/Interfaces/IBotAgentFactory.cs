using System.Reflection;

namespace airo_event_simulation_domain.Interfaces;

public interface IBotAgentFactory
{
    IBotAgent Create(Assembly assembly);
}

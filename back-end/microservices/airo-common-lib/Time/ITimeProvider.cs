namespace airo_common_lib.Time;

public interface ITimeProvider
{
    DateTime Now { get; }
}
namespace anybotics_anymal_api.CustomAttributes;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class AllowAttribute : Attribute
{
    public string[] Roles { get; }

    public AllowAttribute(params string[] roles)
    {
        Roles = roles;
    }
}

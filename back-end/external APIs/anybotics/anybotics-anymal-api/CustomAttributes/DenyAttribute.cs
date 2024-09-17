namespace anybotics_anymal_api.CustomAttributes;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class DenyAttribute : Attribute
{
    public string[] Roles { get; }

    public DenyAttribute(params string[] roles)
    {
        Roles = roles;
    }
}

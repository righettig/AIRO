using anybotics_anymal_api.CustomAttributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace anybotics_anymal_api.Filters;

public class AuthorizationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var actionDescriptor = context.ActionDescriptor;

        // Check Allow attribute
        var allowAttribute = actionDescriptor.EndpointMetadata.OfType<AllowAttribute>().FirstOrDefault();
        if (allowAttribute != null)
        {
            var userRole = GetUserRole(context);
            if (userRole == null || !allowAttribute.Roles.Contains(userRole))
            {
                context.Result = new ForbidResult();
                return;
            }
        }

        // Check Deny attribute
        var denyAttribute = actionDescriptor.EndpointMetadata.OfType<DenyAttribute>().FirstOrDefault();
        if (denyAttribute != null)
        {
            var userRole = GetUserRole(context);
            if (userRole != null && denyAttribute.Roles.Contains(userRole))
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // No implementation needed
    }

    private string? GetUserRole(ActionExecutingContext context) => context.HttpContext.Items["UserRole"] as string;
}

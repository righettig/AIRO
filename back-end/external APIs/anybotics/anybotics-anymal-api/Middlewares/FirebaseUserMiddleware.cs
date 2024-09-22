using anybotics_anymal_api.Services;

namespace anybotics_anymal_api.Middlewares;

public class FirebaseUserMiddleware
{
    private readonly IFirebaseService _firebaseService;
    private readonly RequestDelegate _next;

    public FirebaseUserMiddleware(IFirebaseService firebaseService, RequestDelegate next)
    {
        _firebaseService = firebaseService;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var idToken = context.Request.Headers.Authorization.ToString().Replace("Bearer ", "");

        if (!string.IsNullOrEmpty(idToken))
        {
            try
            {
                var uid = await _firebaseService.GetUidFromTokenAsync(idToken);
                var userRecord = await _firebaseService.GetUserRecordAsync(uid);

                context.Items["UserUid"] = uid;
                context.Items["UserEmail"] = userRecord.Email;

                context.Items["UserRole"] = await _firebaseService.GetUserRoleAsync(userRecord.Email);
            }
            catch
            {
                // Handle errors or set default values
                context.Items["UserUid"] = null;
                context.Items["UserEmail"] = null;
                context.Items["UserRole"] = null;
            }
        }

        await _next(context);
    }
}

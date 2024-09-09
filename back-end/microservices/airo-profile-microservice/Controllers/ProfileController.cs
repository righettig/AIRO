using airo_profile_microservice.Models;
using airo_profile_microservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace airo_profile_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController(IProfileService profileService, ILogger<ProfileController> logger) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProfileRequest request)
    {
        await profileService.CreateProfile(request.Uid, request.AccountType, request.CreditCardDetails);

        return Ok();
    }

    // TODO: uid should be extracted from token
    [HttpGet]
    public async Task<IActionResult> Get(string uid)
    {
        var profile = await profileService.GetByUid(uid);

        return Ok(profile);
    }
}

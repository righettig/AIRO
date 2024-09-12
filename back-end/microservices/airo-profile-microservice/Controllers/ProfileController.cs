using airo_profile_microservice.Models.DTOs;
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
        await profileService.CreateProfile(request.Uid, request.AccountType, request.Email, request.CreditCardDetails);

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Get(string uid)
    {
        var profile = await profileService.GetByUid(uid);

        return Ok(profile);
    }

    [HttpPatch]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequest request)
    {
        await profileService.UpdateProfile(request.Uid, request.FirstName, request.LastName);

        return Ok();
    }
}

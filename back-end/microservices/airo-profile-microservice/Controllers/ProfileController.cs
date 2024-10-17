using airo_profile_microservice.Models.DTOs;
using airo_profile_microservice.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace airo_profile_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController(IProfileService profileService, ILogger<ProfileController> logger) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProfileRequest request)
    {
        logger.LogInformation("Creating profile for UID: {Uid}, AccountType: {AccountType}, Email: {Email}",
            request.Uid, request.AccountType, request.Email);

        await profileService.CreateProfile(request.Uid, request.AccountType, request.Email, request.CreditCardDetails);

        logger.LogInformation("Profile created for UID: {Uid}", request.Uid);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Get(string uid)
    {
        logger.LogInformation("Fetching profile for UID: {Uid}", uid);

        var profile = await profileService.GetByUid(uid);

        if (profile == null)
        {
            logger.LogWarning("Profile not found for UID: {Uid}", uid);
            return NotFound();
        }

        logger.LogInformation("Profile fetched for UID: {Uid}", uid);
        return Ok(profile);
    }

    [HttpPatch]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequest request)
    {
        logger.LogInformation("Updating profile for UID: {Uid}, FirstName: {FirstName}, LastName: {LastName}",
            request.Uid, request.FirstName, request.LastName);

        await profileService.UpdateProfile(request.Uid, request.FirstName, request.LastName);

        logger.LogInformation("Profile updated for UID: {Uid}", request.Uid);
        return Ok();
    }
}

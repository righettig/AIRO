namespace airo_profile_microservice.Models.DTOs;

public record CreateProfileRequest(string Uid, string AccountType, string Email, string? CreditCardDetails);

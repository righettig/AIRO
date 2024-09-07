namespace airo_profile_microservice.Models;

public record CreateProfileRequest(string Uid, string AccountType, string? CreditCardDetails);

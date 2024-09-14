namespace airo_bots_microservice.DTOs;

public record UpdateBotRequest(Guid Id, string Name, decimal Price);

namespace airo_bots_microservice.DTOs;

public record UpdateBotRequest(Guid Id, string Name, decimal Price, int Health, int Attack, int Defense);

namespace airo_bots_microservice.DTOs;

public record CreateBotRequest(string Name, decimal Price, int Health, int Attack, int Defense);

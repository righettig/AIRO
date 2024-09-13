namespace airo_bots_microservice.Domain;

public interface IBotRepository
{
    Task AddAsync(Bot bot);
    Task DeleteAsync(Guid id);
    Task UpdateAsync(Bot bot);
    Task<IEnumerable<Bot>> GetAllAsync();
    Task<Bot> GetAsync(Guid id);
}
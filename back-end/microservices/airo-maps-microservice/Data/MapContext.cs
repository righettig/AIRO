using airo_maps_microservice.Models;
using Microsoft.EntityFrameworkCore;

namespace airo_maps_microservice.Data;

public class MapContext : DbContext
{
    public MapContext(DbContextOptions<MapContext> options) : base(options) { }

    public DbSet<Map> Maps { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Map>()
            .HasNoDiscriminator()
            .ToContainer("maps")
            .HasPartitionKey(map => map.Id)
            .HasKey(map => map.Id);

        base.OnModelCreating(modelBuilder);
    }

    // Override SaveChanges to handle automatic timestamps
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    // Automatically update the CreatedAt and UpdatedAt fields
    private void UpdateTimestamps()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is Map &&
                        (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            var map = (Map)entityEntry.Entity;

            if (entityEntry.State == EntityState.Added)
            {
                map.CreatedAt = DateTime.UtcNow; // Set CreatedAt for new entries
            }

            map.UpdatedAt = DateTime.UtcNow; // Always update UpdatedAt
        }
    }
}

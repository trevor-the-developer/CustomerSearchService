using CustomerSearchService.Data;
using CustomerSearchService.DTOs;
using CustomerSearchService.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace CustomerSearchService.Endpoints;

public static class CustomerSearchEndpoint
{
    public static void MapCustomerSearchEndpoint(this IEndpointRouteBuilder routes, IConfiguration configuration)
    {
        // Get configuration values
        var searchLimit = configuration.GetValue<int>("Api:SearchResultsLimit", 10);
        var minSearchChars = configuration.GetValue<int>("Api:MinSearchCharacters", 2);
        
        // Customer search endpoint with configuration
        routes.MapGet("/api/customers/search", async (
                ApplicationDbContext context,
                string query,
                int? limit,
                ILogger<Program> logger) =>
            {
                var effectiveLimit = Math.Min(limit ?? searchLimit, searchLimit);

                if (string.IsNullOrWhiteSpace(query) || query.Length < minSearchChars)
                {
                    return Results.Ok(new CustomerSearchResponse
                    {
                        Customers = new List<CustomerDto>(),
                        TotalCount = 0
                    });
                }

                var stopwatch = Stopwatch.StartNew();
                
                // Single optimized query - eliminate duplicate WHERE clause execution
                var allMatchingCustomers = await context.Customers
                    .Include(c => c.Tags)
                    .Where(c => EF.Functions.Like(c.Name, $"%{query}%") ||
                                EF.Functions.Like(c.Address, $"%{query}%") ||
                                EF.Functions.Like(c.Postcode, $"%{query}%") ||
                                c.Tags.Any(t => EF.Functions.Like(t.Name, $"%{query}%")))
                    .Select(c => new CustomerDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Address = c.Address,
                        Postcode = c.Postcode,
                        Tags = c.Tags.Select(t => t.Name).ToArray()
                    })
                    .ToListAsync();

                stopwatch.Stop();
                
                // Get count from materialized results and apply pagination
                var totalCount = allMatchingCustomers.Count;
                var customers = allMatchingCustomers.Take(effectiveLimit).ToList();
                
                logger.LogInformation("Customer search for '{Query}' returned {TotalCount} results in {ElapsedMs}ms", 
                    query, totalCount, stopwatch.ElapsedMilliseconds);

                return Results.Ok(new CustomerSearchResponse
                {
                    Customers = customers,
                    TotalCount = totalCount
                });
            })
            .WithName("SearchCustomers")
            .WithOpenApi();
    }
}
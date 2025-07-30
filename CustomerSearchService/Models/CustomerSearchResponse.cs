using CustomerSearchService.DTOs;

namespace CustomerSearchService.Models;

public class CustomerSearchResponse
{
    public List<CustomerDto> Customers { get; set; } = new();
    public int TotalCount { get; set; }
}
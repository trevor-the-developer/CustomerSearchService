namespace CustomerSearchService.DTOs;

public class CustomerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string[] Tags { get; set; } = Array.Empty<string>();
}
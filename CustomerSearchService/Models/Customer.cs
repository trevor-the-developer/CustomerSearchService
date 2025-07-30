namespace CustomerSearchService.Models;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public List<Tag> Tags { get; set; } = new();
}
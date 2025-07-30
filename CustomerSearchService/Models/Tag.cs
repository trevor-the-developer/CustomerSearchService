namespace CustomerSearchService.Models;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<Customer> Customers { get; set; } = new();
}
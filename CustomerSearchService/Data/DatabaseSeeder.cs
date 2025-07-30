using CustomerSearchService.Models;

namespace CustomerSearchService.Data;

public static class DatabaseSeeder
{
    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        // Check if data already exists
        if (context.Customers.Any())
        {
            return; // Database has been seeded
        }

        // Create tags first
        var tags = new List<Tag>
        {
            new Tag { Name = "VIP" },
            new Tag { Name = "Premium" },
            new Tag { Name = "Corporate" },
            new Tag { Name = "Residential" },
            new Tag { Name = "Business" },
            new Tag { Name = "New Customer" },
            new Tag { Name = "Long Term" },
            new Tag { Name = "High Volume" },
            new Tag { Name = "Priority Support" },
            new Tag { Name = "International" }
        };

        context.Tags.AddRange(tags);
        await context.SaveChangesAsync();

        // Create customers with various tags
        var customers = new List<Customer>
        {
            new Customer
            {
                Name = "John Smith",
                Address = "123 High Street, London",
                Postcode = "SW1A 1AA",
                Tags = new List<Tag> { tags[0], tags[3] } // VIP, Residential
            },
            new Customer
            {
                Name = "Sarah Johnson",
                Address = "45 Victoria Road, Manchester",
                Postcode = "M1 2AB",
                Tags = new List<Tag> { tags[1], tags[4] } // Premium, Business
            },
            new Customer
            {
                Name = "Microsoft UK Ltd",
                Address = "Thames Valley Park, Reading",
                Postcode = "RG6 1WG",
                Tags = new List<Tag> { tags[2], tags[7], tags[8] } // Corporate, High Volume, Priority Support
            },
            new Customer
            {
                Name = "Emily Davis",
                Address = "78 Queen Street, Birmingham",
                Postcode = "B1 3CD",
                Tags = new List<Tag> { tags[5], tags[3] } // New Customer, Residential
            },
            new Customer
            {
                Name = "Robert Wilson",
                Address = "92 King's Road, Edinburgh",
                Postcode = "EH1 4EF",
                Tags = new List<Tag> { tags[6], tags[0] } // Long Term, VIP
            },
            new Customer
            {
                Name = "Amazon Web Services",
                Address = "Principal Place, London",
                Postcode = "EC2A 2FA",
                Tags = new List<Tag> { tags[2], tags[9], tags[8] } // Corporate, International, Priority Support
            },
            new Customer
            {
                Name = "Lisa Thompson",
                Address = "156 Castle Street, Cardiff",
                Postcode = "CF10 1BH",
                Tags = new List<Tag> { tags[1], tags[4] } // Premium, Business
            },
            new Customer
            {
                Name = "David Brown",
                Address = "23 Market Square, Leeds",
                Postcode = "LS1 5GH",
                Tags = new List<Tag> { tags[3], tags[6] } // Residential, Long Term
            },
            new Customer
            {
                Name = "TechStart Solutions",
                Address = "89 Innovation Drive, Cambridge",
                Postcode = "CB4 0WS",
                Tags = new List<Tag> { tags[4], tags[5], tags[7] } // Business, New Customer, High Volume
            },
            new Customer
            {
                Name = "Jennifer Martinez",
                Address = "67 Elm Grove, Brighton",
                Postcode = "BN1 7IJ",
                Tags = new List<Tag> { tags[0], tags[9] } // VIP, International
            },
            new Customer
            {
                Name = "GlobalTech Industries",
                Address = "Central Business Park, Glasgow",
                Postcode = "G2 8KL",
                Tags = new List<Tag> { tags[2], tags[6], tags[8] } // Corporate, Long Term, Priority Support
            },
            new Customer
            {
                Name = "Michael O'Connor",
                Address = "34 Phoenix Street, Belfast",
                Postcode = "BT1 2MN",
                Tags = new List<Tag> { tags[3], tags[1] } // Residential, Premium
            }
        };

        context.Customers.AddRange(customers);
        await context.SaveChangesAsync();
    }
}
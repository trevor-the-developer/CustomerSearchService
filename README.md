# Customer Search Service

A full-stack customer search application built with .NET 8 ASP.NET Core backend and Angular 20+ frontend. This application provides fast, real-time customer search functionality with a professional web interface.

## 🏗️ Architecture

### Backend (.NET 8)
- **ASP.NET Core 9.0** minimal API
- **Entity Framework Core** with SQL Server
- **RESTful API** with OpenAPI/Swagger documentation
- **Docker** containerized database
- **CORS** enabled for frontend integration

### Frontend (Angular 20+)
- **Angular 20+** with standalone components
- **TypeScript** for type safety
- **Real-time search** with debouncing
- **Responsive design** for mobile/desktop
- **Professional UI** with autocomplete functionality

## 🚀 Quick Start

### Prerequisites
- **.NET 8 SDK** or later
- **Node.js 18+** and npm
- **Docker** and Docker Compose
- **Git**

### 1. Clone and Setup
```bash
git clone <repository-url>
cd CustomerSearchService
```

### 2. Start Database
```bash
docker-compose up -d
```

### 3. Install Dependencies
```bash
# Root level dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 4. Run the Full Application
```bash
# Start both backend and frontend together
npm run dev
```

**OR run separately:**
```bash
# Terminal 1: Backend
dotnet run --project CustomerSearchService

# Terminal 2: Frontend
cd frontend && npm run serve
```

### 5. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5175
- **Swagger Docs**: http://localhost:5175/swagger

## 📁 Project Structure

```
CustomerSearchService/
├── CustomerSearchService/           # .NET Backend
│   ├── Controllers/
│   ├── Data/                       # Entity Framework context
│   ├── DTOs/                       # Data transfer objects
│   ├── Endpoints/                  # API endpoints
│   ├── Models/                     # Domain models
│   ├── Migrations/                 # EF migrations
│   └── Program.cs                  # Application entry point
├── frontend/                       # Angular Frontend
│   ├── src/app/
│   │   ├── components/            # Angular components
│   │   ├── models/                # TypeScript interfaces
│   │   ├── services/              # HTTP services
│   │   └── environments/          # Environment configs
│   ├── proxy.conf.json            # Development proxy
│   └── package.json
├── docker-compose.yml              # SQL Server container
├── package.json                    # Root build scripts
└── README.md
```

## 🔧 Development

### Backend Development
```bash
# Build solution
dotnet build CustomerSearchService.sln

# Run backend only
dotnet run --project CustomerSearchService

# Add EF migration
dotnet ef migrations add <MigrationName> --project CustomerSearchService

# Update database
dotnet ef database update --project CustomerSearchService
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run serve

# Build for production
npm run build

# Run tests
npm run test
```

### Database Management
```bash
# Start SQL Server container
docker-compose up -d

# Stop container
docker-compose down

# View logs
docker-compose logs sqlserver
```

## 🔍 API Documentation

### Customer Search Endpoint
```
GET /api/customers/search?query={searchTerm}&limit={number}
```

**Parameters:**
- `query`: Search term (minimum 2 characters)
- `limit`: Maximum results to return (default: 10, max: 50)

**Response:**
```json
{
  "customers": [
    {
      "id": 1,
      "name": "John Smith",
      "address": "123 High Street, London",
      "postcode": "SW1A 1AA",
      "tags": ["VIP", "Residential"]
    }
  ],
  "totalCount": 1
}
```

### Search Features
- Search by **customer name**
- Search by **address**
- Search by **postcode**
- Search by **associated tags**
- Configurable result limits
- Case-insensitive matching

## 🧪 Testing

### Backend Testing
```bash
# Test API directly
curl "http://localhost:5175/api/customers/search?query=john&limit=5"

# Health check
curl "http://localhost:5175/health"
```

### Frontend Testing
```bash
cd frontend
npm run test
```

### Integration Testing
1. Start backend: `dotnet run --project CustomerSearchService`
2. Start frontend: `cd frontend && npm run serve`
3. Open browser: http://localhost:4200
4. Test search functionality with sample data

## ⚙️ Configuration

### Backend Configuration (`appsettings.Development.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=CustomerDB;..."
  },
  "Api": {
    "SearchResultsLimit": 50,
    "MinSearchCharacters": 2
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:4200"]
  }
}
```

### Frontend Environment (`frontend/src/environments/`)
- `environment.ts`: Development settings
- `environment.prod.ts`: Production settings

## 🏗️ Build & Deployment

### Production Build
```bash
# Build everything
npm run build

# Backend only
dotnet build CustomerSearchService.sln --configuration Release

# Frontend only
cd frontend && npm run build
```

### Docker Deployment
The application includes Docker Compose configuration for the SQL Server database. For full containerization, you can extend the docker-compose.yml to include the application services.

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure SQL Server container is running: `docker-compose up -d`
- Check connection string in appsettings.json
- Verify .NET 8 SDK is installed

**Frontend API calls fail:**
- Verify backend is running on localhost:5175
- Check CORS configuration includes http://localhost:4200
- Ensure proxy.conf.json is configured correctly

**No search results:**
- Check if database has been seeded with sample data
- Verify API endpoint manually: `curl "http://localhost:5175/api/customers/search?query=test"`
- Check browser developer tools for network errors

**Build errors:**
- Run `npm install` in both root and frontend directories
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall if needed

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run frontend:dev` | Start frontend only |
| `npm run backend:dev` | Start backend only |
| `npm run build` | Build both projects |
| `npm run frontend:build` | Build frontend only |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
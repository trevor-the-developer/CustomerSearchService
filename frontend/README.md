# Customer Search Frontend

A modern Angular 20+ frontend application for searching and managing customers. This application provides a real-time search interface with autocomplete functionality that integrates seamlessly with the .NET backend API.

## Features

- **Real-time Search**: Debounced search with 300ms delay for optimal performance
- **Autocomplete Interface**: Professional dropdown with customer results
- **Keyboard Navigation**: Arrow keys, Enter, and Escape support
- **Responsive Design**: Mobile-first design that works on all devices
- **Error Handling**: User-friendly error messages and loading states
- **TypeScript**: Fully typed with interfaces matching backend DTOs

## Technology Stack

- **Angular 20+** with standalone components
- **TypeScript** for type safety
- **RxJS** for reactive programming
- **CSS3** with responsive design
- **HTTP Client** with proxy configuration

## Development

### Prerequisites
- Node.js 18+ 
- npm 8+
- Backend API running on localhost:5175

### Installation
```bash
npm install
```

### Development Server
```bash
npm run serve
```
Navigate to `http://localhost:4200`. The app will automatically reload if you change any source files.

### Build
```bash
npm run build
```
Build artifacts will be stored in the `dist/` directory.

### Testing
```bash
npm run test
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── customer-autocomplete/    # Main search component
│   ├── models/
│   │   └── customer.interface.ts     # TypeScript interfaces
│   ├── services/
│   │   └── customer.service.ts       # API communication
│   ├── environments/                 # Environment configs
│   ├── app.ts                        # Main app component
│   ├── app.html                      # App template
│   └── app.css                       # App styles
└── proxy.conf.json                   # Development proxy config
```

## API Integration

The frontend connects to the backend API through:
- **Development**: Proxy configuration routes `/api/*` to `http://localhost:5175`
- **Production**: Environment configuration for production API URLs

## Configuration

### Environment Variables
- `environment.ts`: Development settings
- `environment.prod.ts`: Production settings

### Proxy Configuration
The `proxy.conf.json` file routes API calls to the backend during development, eliminating CORS issues.

## Usage

1. Start typing in the search box (minimum 2 characters)
2. View real-time search results in the dropdown
3. Use arrow keys to navigate results
4. Press Enter or click to select a customer
5. View full customer details in the results panel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
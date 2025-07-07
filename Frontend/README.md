# Student Result Management System - Frontend

A modern React application for managing student records, courses, and academic results with real-time updates and responsive design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for server state management
- **React Hook Form + Zod** for form validation
- **Axios** for API communication

## 🎯 Features

- ✅ Student Management (Add, View, Delete)
- ✅ Course Management (Add, View, Delete) 
- ✅ Result Management with UPSERT behavior
- ✅ Real-time Dashboard with Statistics
- ✅ Responsive Design for all devices
- ✅ Form Validation with detailed error messages
- ✅ Loading states and error handling

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route-specific pages
├── api/           # API service functions
├── types/         # TypeScript type definitions
├── validation/    # Zod validation schemas
└── utils/         # Helper functions
```

## 🔧 Environment Setup

Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📚 Documentation

For detailed documentation, see:
- [Frontend Architecture](../docs/FRONTEND_DOCUMENTATION.md)
- [API Documentation](../docs/API.md)

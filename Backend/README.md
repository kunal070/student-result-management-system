# Student Result Management System - Backend

A robust Express.js API server with TypeScript, SQLite database, and comprehensive validation for managing students, courses, and academic results.

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

The API will be available at `http://localhost:5000`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report

## 🛠️ Tech Stack

- **Express.js** with TypeScript
- **SQLite** with better-sqlite3 driver
- **Zod** for schema validation
- **Vitest** for testing
- **WAL mode** for database performance

## 🎯 API Endpoints

### Health Check
- `GET /api/health` - API and database status

### Students
- `GET /api/students/list` - Get all students
- `GET /api/students/list/:id` - Get student by ID
- `POST /api/students/create` - Create new student
- `DELETE /api/students/delete/:id` - Delete student

### Courses
- `GET /api/courses/list` - Get all courses
- `GET /api/courses/list/:id` - Get course by ID
- `POST /api/courses/create` - Create new course
- `DELETE /api/courses/delete/:id` - Delete course

### Results
- `GET /api/results/list` - Get all results with student/course info
- `POST /api/results/create` - Create/update result (UPSERT)
- `DELETE /api/results/delete/:id` - Delete result

## 🏗️ Project Structure

```
src/
├── controllers/    # HTTP request handlers
├── services/      # Business logic layer
├── routes/        # API route definitions
├── validation/    # Zod schema validation
├── middleware/    # Custom middleware
├── lib/          # Database configuration
└── index.ts      # Application entry point
```

## 💾 Database

- **SQLite** database with automatic initialization
- **WAL mode** for better concurrency
- **Foreign key constraints** with cascade deletes
- **UPSERT operations** for conflict resolution

### Database Files
- `students.db` - Main database (auto-created)
- `students-test.db` - Test database (auto-created during testing)

## ✅ Key Features

- **Enhanced Validation**: Multi-layer validation with Zod schemas
- **UPSERT Logic**: Smart handling of duplicate student-course combinations
- **Cascade Deletes**: Automatic cleanup of related records
- **Disposable Email Blocking**: Prevents temporary email addresses
- **Age Validation**: Students must be 10-100 years old
- **Prepared Statements**: SQL injection protection
- **Comprehensive Testing**: Full test coverage with Vitest

## 🔧 Validation Rules

### Students
- **Names**: 1-50 chars, letters/spaces/hyphens/apostrophes only
- **Email**: Valid format, unique, no disposable domains
- **Date of Birth**: Age 10-100 years

### Courses
- **Course Name**: 3-100 chars, alphanumeric + basic punctuation, unique

### Results
- **Grade**: Exactly one of: A, B, C, D, E, F (case-sensitive)
- **Student/Course IDs**: Valid UUIDs, must exist in database

## 📚 Documentation

For detailed documentation, see:
- [API Documentation](../docs/API.md)
- [Backend Architecture](../docs/BACKEND_DOCUMENTATION.md)
- [Database Schema](../docs/DATABASE_SCHEMA.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test students.test.ts
```

## 🚨 Error Handling

The API returns standardized error responses:
- `400` - Validation errors with field-specific messages
- `404` - Resource not found
- `409` - Conflict (duplicate email/course name)
- `500` - Internal server error

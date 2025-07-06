# Backend Architecture Documentation

## Overview
This document outlines the architecture of the Student Result Management System backend, built with Node.js, Express.js, TypeScript, and SQLite.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Database**: SQLite 3 with better-sqlite3 9.6.0
- **Validation**: Zod 3.22.4
- **Testing**: Vitest 3.2.4 with Supertest 6.3.3

### Development Tools
- **Build Tool**: TSX 4.6.2 for development
- **Type Checking**: TypeScript with strict mode enabled
- **Code Coverage**: Vitest with V8 provider
- **Process Management**: Built-in Node.js process handling

## Project Structure

```
src/
├── controllers/           # HTTP request handlers
│   ├── student.controller.ts
│   ├── course.controller.ts
│   └── result.controller.ts
├── services/             # Business logic layer
│   ├── student.service.ts
│   ├── course.service.ts
│   └── result.service.ts
├── routes/               # API route definitions
│   ├── student.routes.ts
│   ├── course.routes.ts
│   └── result.routes.ts
├── validation/           # Zod schema definitions
│   ├── student.validation.ts
│   ├── course.validation.ts
│   └── result.validation.ts
├── middleware/           # Custom middleware
│   └── validateRequest.ts
├── lib/                  # Core utilities
│   └── database.ts
└── index.ts              # Application entry point

tests/
├── setup/               # Test configuration
│   ├── testSetup.ts
│   └── testDatabase.ts
├── helpers/             # Test utilities
│   ├── factories.ts
│   └── assertions.ts
└── integration/         # Integration tests
    ├── students.test.ts
    ├── courses.test.ts
    └── results.test.ts
```

## Architectural Patterns

### MVC with Services Layer
- **Controllers**: Handle HTTP requests/responses, delegate to services
- **Services**: Contain business logic and database operations
- **Models**: Defined implicitly through TypeScript interfaces
- **Validation**: Separated into dedicated schema files using Zod

### Request Flow
1. **Request** → Express Router
2. **Validation** → Zod middleware validates request data
3. **Controller** → Delegates to appropriate service method
4. **Service** → Executes business logic and database operations
5. **Response** → Standardized JSON response format

## Database Architecture

### Connection Management
- **Single Connection**: Uses better-sqlite3 with optimized pragmas
- **Journal Mode**: WAL (Write-Ahead Logging) for better concurrency
- **Connection Lifecycle**: Managed through database module with cleanup handlers

### Performance Optimizations
- **Prepared Statements**: All queries use prepared statements for performance
- **Indexing Strategy**: Strategic indexes on foreign keys and frequently queried columns
- **Memory Mapping**: 256MB mmap_size for large dataset handling
- **Cache Configuration**: 1000-page cache for improved query performance

## Validation Architecture

### Multi-Layer Validation
1. **Schema Validation**: Zod schemas validate data types and formats
2. **Business Rules**: Custom validation logic in schemas
3. **Database Constraints**: SQL-level constraints as final validation layer

### Custom Validation Features
- **Disposable Email Detection**: Blocks common disposable email domains
- **Age Calculation**: Validates student age between 10-100 years
- **UUID Format Validation**: Ensures proper UUID format for foreign keys
- **Text Normalization**: Automatic trimming and case normalization

## Error Handling Strategy

### Centralized Error Processing
- **Validation Errors**: 400 status with structured error details
- **Conflict Errors**: 409 status for uniqueness violations
- **Not Found Errors**: 404 status for missing resources
- **Server Errors**: 500 status with sanitized error messages

### Error Response Format
```typescript
{
  success: false,
  message: string,
  data: null,
  statusCode: number,
  errors?: Record<string, string[]>
}
```

## Security Considerations

### Data Protection
- **UUID Primary Keys**: Prevents enumeration attacks
- **Parameterized Queries**: SQL injection prevention
- **Input Sanitization**: Multi-layer validation and normalization
- **Email Uniqueness**: Prevents account duplication

### Access Control
- **CORS Configuration**: Restricted to frontend origin
- **No Direct Database Access**: All operations through service layer
- **Request Validation**: Comprehensive input validation on all endpoints

## Testing Architecture

### Test Strategy
- **Integration Tests**: Full request-response cycle testing
- **Test Isolation**: Separate test database with cleanup between tests
- **Data Factories**: Reusable test data generation
- **Custom Assertions**: Specialized assertion helpers for API responses

### Test Configuration
- **Framework**: Vitest with Node.js environment
- **Database**: Separate `students-test.db` for test isolation
- **Coverage**: V8 provider with HTML/JSON/text reporting
- **Concurrency**: Sequential test execution to avoid database conflicts

## Performance Considerations

### Database Performance
- **WAL Mode**: Enables concurrent reads during writes
- **Prepared Statements**: Cached query execution plans
- **Strategic Indexing**: Optimized for common query patterns
- **Connection Pooling**: Single connection with optimized configuration

### Application Performance
- **Async/Await**: Non-blocking database operations
- **Error Caching**: Proper error handling without memory leaks
- **Response Caching**: Structured responses for consistent performance

## Deployment Architecture

### Environment Configuration
- **Development**: Hot reloading with TSX
- **Testing**: Isolated test environment with separate database
- **Production**: Compiled TypeScript with optimized settings

### Database Management
- **Migrations**: Automatic schema initialization on startup
- **Backup Strategy**: File-based SQLite backups
- **Health Checks**: Database connectivity monitoring

## Monitoring and Logging

### Application Monitoring
- **Health Endpoint**: `/api/health` for service status
- **Database Health**: Connection and integrity checks
- **Error Logging**: Comprehensive error tracking

### Performance Monitoring
- **Query Performance**: Prepared statement execution tracking
- **Response Times**: Request processing duration
- **Resource Usage**: Memory and CPU monitoring capabilities

---

*Last Updated: July 2025*  
*Architecture Version: 1.0*  
*Backend Framework: Express.js with TypeScript*
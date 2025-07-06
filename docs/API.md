# API Documentation - Updated

## Base URL
`http://localhost:5000/api`

## Health Check

### GET /health
Returns the health status of the API and database connectivity.

**Response:**
```json
{
  "status": "UP",
  "message": "API is running fine."
}
```

## Students Endpoints

### GET /students/list
Returns all students ordered by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "dateOfBirth": "2000-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "statusCode": 200
}
```

### GET /students/list/:id
Returns a specific student by ID.

**Parameters:**
- `id` (string): Student UUID

**Response (Success):**
```json
{
  "success": true,
  "message": "Student found",
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "dateOfBirth": "2000-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "statusCode": 200
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Student not found",
  "data": null,
  "statusCode": 404
}
```

**Response (Invalid ID):**
```json
{
  "success": false,
  "message": "Invalid student ID",
  "data": null,
  "statusCode": 400
}
```

### POST /students/create
Creates a new student with comprehensive validation.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "dateOfBirth": "2000-01-01"
}
```

**Enhanced Validation Rules:**
- `firstName`: Required, 1-50 characters, letters/spaces/hyphens/apostrophes only, trimmed
- `lastName`: Required, 1-50 characters, letters/spaces/hyphens/apostrophes only, trimmed
- `email`: Required, valid email format, max 100 characters, converted to lowercase, no disposable email domains
- `dateOfBirth`: Required, student must be between 10-100 years old

**Blocked Disposable Email Domains:**
- tempmail.com, throwaway.email, 10minutemail.com, guerrillamail.com, mailinator.com, trashmail.com

**Response (Success):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "dateOfBirth": "2000-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "statusCode": 201
}
```

**Response (Conflict - Email exists):**
```json
{
  "success": false,
  "message": "A student with this email already exists",
  "data": null,
  "statusCode": 409,
  "errors": {
    "email": ["Email address is already registered"]
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "firstName": ["First name can only contain letters, spaces, hyphens, and apostrophes"],
    "email": ["Disposable email addresses are not allowed"],
    "dateOfBirth": ["Invalid date of birth. Student must be between 10 and 100 years old"]
  }
}
```

### DELETE /students/delete/:id
Deletes a student by ID. **Note: Cascade deletes all related results.**

**Parameters:**
- `id` (string): Student UUID

**Response (Success):**
```
Status: 204 No Content
```

**Response (Not Found):**
```
Status: 404 Not Found
```

**Response (Invalid ID):**
```json
{
  "success": false,
  "message": "Invalid student ID",
  "data": null,
  "statusCode": 400
}
```

## Courses Endpoints

### GET /courses/list
Returns all courses ordered by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "courseName": "Mathematics",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "statusCode": 200
}
```

### GET /courses/list/:id
Returns a specific course by ID.

**Parameters:**
- `id` (string): Course UUID

**Response (Success):**
```json
{
  "success": true,
  "message": "Course found",
  "data": {
    "id": "uuid",
    "courseName": "Mathematics",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "statusCode": 200
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Course not found",
  "data": null,
  "statusCode": 404
}
```

### POST /courses/create
Creates a new course with enhanced validation.

**Request Body:**
```json
{
  "courseName": "Mathematics"
}
```

**Enhanced Validation Rules:**
- `courseName`: Required, 3-100 characters, alphanumeric + basic punctuation, trimmed, cannot be only whitespace
- **Allowed Characters**: Letters, numbers, spaces, hyphens, ampersands, parentheses, commas, periods
- **Invalid Characters Rejected**: Special symbols, emojis, control characters

**Response (Success):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "uuid",
    "courseName": "Mathematics",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "statusCode": 201
}
```

**Response (Conflict - Course name exists):**
```json
{
  "success": false,
  "message": "Invalid request data",
  "data": null,
  "statusCode": 409,
  "errors": {
    "courseName": ["This course name is already registered. Please use a different name."]
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "courseName": ["Course name must be at least 3 characters after trimming"]
  }
}
```

### DELETE /courses/delete/:id
Deletes a course by ID. **Note: Cascade deletes all related results.**

**Parameters:**
- `id` (string): Course UUID

**Response (Success):**
```
Status: 204 No Content
```

**Response (Not Found):**
```
Status: 404 Not Found
```

## Results Endpoints

### GET /results/list
Returns all results with student and course information, ordered by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "studentId": "student-uuid",
      "courseId": "course-uuid",
      "grade": "A",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z",
      "student": {
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe"
      },
      "course": {
        "courseName": "Mathematics"
      }
    }
  ],
  "statusCode": 200
}
```

### POST /results/create
Creates a new result or updates an existing one if the student-course combination already exists (UPSERT behavior).

**Request Body:**
```json
{
  "studentId": "student-uuid",
  "courseId": "course-uuid",
  "grade": "A"
}
```

**Enhanced Validation Rules:**
- `studentId`: Required, valid UUID v4 format, must exist in database
- `courseId`: Required, valid UUID v4 format, must exist in database
- `grade`: Required, must be exactly one of: A, B, C, D, E, F (case-sensitive)

**Response (New Result Created):**
```json
{
  "success": true,
  "message": "Result created successfully",
  "data": {
    "id": "uuid",
    "studentId": "student-uuid",
    "courseId": "course-uuid",
    "grade": "A",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "firstName": "John",
    "lastName": "Doe",
    "courseName": "Mathematics"
  },
  "statusCode": 201
}
```

**Response (Existing Result Updated):**
```json
{
  "success": true,
  "message": "Result updated successfully",
  "data": {
    "id": "uuid",
    "studentId": "student-uuid",
    "courseId": "course-uuid",
    "grade": "B",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "firstName": "John",
    "lastName": "Doe",
    "courseName": "Mathematics"
  },
  "statusCode": 200
}
```

**Response (Invalid Foreign Key):**
```json
{
  "success": false,
  "message": "Invalid student or course ID",
  "data": null,
  "statusCode": 400
}
```

**Response (Invalid UUID Format):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "studentId": ["Invalid student ID format. Must be a valid UUID"],
    "grade": ["Grade must be one of: A, B, C, D, E, or F"]
  }
}
```

### DELETE /results/delete/:id
Deletes a result by ID.

**Parameters:**
- `id` (string): Result UUID

**Response (Success):**
```
Status: 204 No Content
```

**Response (Not Found):**
```
Status: 404 Not Found
```

## Enhanced Error Responses

### 400 Bad Request (Validation)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fieldName": ["Detailed error message"],
    "anotherField": ["Another error message", "Multiple errors possible"]
  }
}
```

### 400 Bad Request (Invalid ID)
```json
{
  "success": false,
  "message": "Invalid student ID",
  "data": null,
  "statusCode": 400
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "data": null,
  "statusCode": 404
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Conflict error message",
  "data": null,
  "statusCode": 409,
  "errors": {
    "fieldName": ["Conflict error message"]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Special Behaviors

### UPSERT Operations
- **Results**: Creating a result for an existing student-course combination updates the existing record instead of creating a duplicate
- **Response Codes**: 201 for new records, 200 for updates

### Cascade Deletions
- **Student Deletion**: Automatically removes all associated results
- **Course Deletion**: Automatically removes all associated results
- **Foreign Key Integrity**: Maintained through database constraints

### Data Normalization
- **Email Addresses**: Automatically converted to lowercase and trimmed
- **Names**: Trimmed of leading/trailing whitespace
- **Course Names**: Trimmed and validated for content

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Frontend development server)
- Credentials are enabled for cookie-based authentication

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production deployment.

## Database Schema Summary

### Students Table
- `id`: TEXT PRIMARY KEY (UUID v4)
- `firstName`: TEXT NOT NULL (1-50 chars, validated pattern)
- `lastName`: TEXT NOT NULL (1-50 chars, validated pattern)
- `email`: TEXT UNIQUE NOT NULL (max 100 chars, no disposable domains)
- `dateOfBirth`: DATETIME NOT NULL (age 10-100 years)
- `createdAt`: DATETIME DEFAULT CURRENT_TIMESTAMP
- `updatedAt`: DATETIME DEFAULT CURRENT_TIMESTAMP

### Courses Table
- `id`: TEXT PRIMARY KEY (UUID v4)
- `courseName`: TEXT UNIQUE NOT NULL (3-100 chars, validated pattern)
- `createdAt`: DATETIME DEFAULT CURRENT_TIMESTAMP
- `updatedAt`: DATETIME DEFAULT CURRENT_TIMESTAMP

### Results Table
- `id`: TEXT PRIMARY KEY (UUID v4)
- `studentId`: TEXT NOT NULL (Foreign Key to students.id, CASCADE DELETE)
- `courseId`: TEXT NOT NULL (Foreign Key to courses.id, CASCADE DELETE)
- `grade`: TEXT CHECK(grade IN ('A', 'B', 'C', 'D', 'E', 'F')) NOT NULL
- `createdAt`: DATETIME DEFAULT CURRENT_TIMESTAMP
- `updatedAt`: DATETIME DEFAULT CURRENT_TIMESTAMP
- UNIQUE constraint on (studentId, courseId)

## Performance Features

- **Prepared Statements**: All database queries use prepared statements
- **Indexing**: Strategic indexes on foreign keys and frequently queried fields
- **WAL Mode**: Write-Ahead Logging for better concurrency
- **Connection Optimization**: Single connection with optimized SQLite pragmas

---

*Last Updated: July 2025*  
*API Version: 1.0*  
*Backend: Express.js with TypeScript and SQLite*
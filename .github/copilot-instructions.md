# AI Agent Instructions for SAMPOU Project

This document provides guidance for AI agents working on the SAMPOU project, based on the project specifications outlined in the Cahier des Charges.

## Project Overview

SAMPOU is a school management application designed to streamline educational administration and enhance communication between stakeholders.

### Core Features
1. Student Management:
   - Enrollment and registration
   - Student profiles and academic history
   - Document management (transcripts, certificates)
   - Student progress tracking

2. Academic Management:
   - Course catalog and curriculum management
   - Class scheduling and timetables
   - Grade recording and report generation
   - Attendance tracking and reporting

3. User Management:
   - Role-based access control (RBAC)
   - User profiles for students, teachers, parents, admin
   - Activity logging and audit trails
   - Permission management

4. Communication:
   - Internal messaging system
   - Announcements and notifications
   - Parent-teacher communication portal
   - Document sharing and collaboration

## Development Setup & Workflow

### Required Tools & Versions
```bash
node >= 18.x
npm >= 9.x
PostgreSQL >= 14
Redis >= 6
```

### Initial Project Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your local settings

# Setup database
npm run db:migrate
npm run db:seed

# Start development
npm run dev
```

## Project Structure

### Directory Organization
```
/src
  /auth                  # Authentication system
    /strategies/         # Auth strategies (JWT, OAuth)
    /middleware/         # Auth middleware
    /controllers/        # Auth logic
    
  /models               # Domain models
    /student/           # Student-related models
    /academic/          # Academic-related models
    /user/              # User-related models
    
  /api                 # API endpoints
    /v1/               # Version 1 API routes
    /middleware/       # API middleware
    /validators/       # Request validation
    
  /services           # Business logic
    /academic/        # Academic services
    /notification/    # Notification services
    /reporting/       # Report generation
    
  /utils              # Shared utilities
    /validation/      # Input validation
    /security/        # Security utilities
    /formatting/      # Data formatting
```

## Core Models & Data Structures

### User Models
```typescript
interface User {
  id: string;
  email: string;
  role: UserRole;        // 'admin' | 'teacher' | 'student' | 'parent'
  status: UserStatus;    // 'active' | 'inactive' | 'suspended'
  firstName: string;
  lastName: string;
  lastLogin: Date;
}

interface Student extends User {
  studentId: string;     // School-assigned ID
  grade: number;
  dateOfBirth: Date;
  guardianId: string;
  academicRecord: AcademicRecord;
}

interface Teacher extends User {
  teacherId: string;
  subjects: Subject[];
  classGroups: ClassGroup[];
}
```

### Academic Models
```typescript
interface Course {
  id: string;
  code: string;         // e.g., 'MATH101'
  name: string;
  credits: number;
  department: string;
  prerequisites: string[];
}

interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  value: number;        // 0-100
  type: GradeType;      // 'exam' | 'quiz' | 'homework'
  submittedBy: string;  // teacherId
  submittedAt: Date;
}
```

## API Patterns

### Authentication
```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;     // Required for admin access
}

interface AuthResponse {
  token: string;        // JWT access token
  refreshToken: string; // For token renewal
  user: UserProfile;
}
```

### Error Handling
```typescript
interface ApiError {
  code: string;         // e.g., 'AUTH_FAILED'
  message: string;      // User-friendly message
  details?: object;     // Additional context
}

// Example error response
{
  "error": {
    "code": "INVALID_GRADE",
    "message": "Grade value must be between 0 and 100",
    "details": {
      "field": "value",
      "provided": 101
    }
  }
}
```

## Development Guidelines

### Security Requirements
1. Authentication:
   - JWT tokens with max 1h expiry
   - Refresh tokens for session extension
   - MFA required for admin access
   - Password rules: min 12 chars, mixed case, numbers

2. Data Protection:
   - All PII must be encrypted at rest
   - TLS 1.3 required for all API calls
   - Rate limiting on authentication endpoints
   - SQL injection prevention via parameterized queries

### Testing Requirements
1. Unit Tests (Jest):
   ```typescript
   describe('GradeService', () => {
     it('should calculate semester GPA', () => {
       expect(calculateGPA([
         { grade: 85, credits: 3 },
         { grade: 90, credits: 4 }
       ])).toBe(87.85);
     });
   });
   ```

2. API Tests (Supertest):
   ```typescript
   describe('Authentication', () => {
     it('should reject invalid credentials', async () => {
       const res = await request(app)
         .post('/api/v1/auth/login')
         .send({ email: 'test@test.com', password: 'wrong' });
       expect(res.status).toBe(401);
     });
   });
   ```

## Common Tasks & Commands

### Database Operations
```bash
# Create new migration
npm run db:migration:create name_of_migration

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Seed test data
npm run db:seed
```

### Testing Commands
```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.spec.ts

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Build & Deployment
```bash
# Development
npm run dev          # Start dev server
npm run lint         # Run linter
npm run type-check   # Run TypeScript checks

# Production
npm run build        # Build for production
npm run start        # Start production server
```

## Documentation References

- API Documentation: `http://localhost:3000/api/docs`
- Database Schema: `docs/database/schema.md`
- Frontend Components: `docs/frontend/components.md`
- Security Guidelines: `docs/security/guidelines.md`

---

Note: This document is continuously updated based on project evolution and team feedback.
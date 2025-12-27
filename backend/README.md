# Backend - Student Management System

Node.js + Express REST API for Student Management.

## Prerequisites

- Node.js 16+
- MySQL 8+

## Database Setup

Create a MySQL database and run the following SQL:

```sql
CREATE DATABASE student_management;
USE student_management;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  credits INT,
  instructor VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, course_id)
);
```

## Environment Variables

Create a `.env` file (optional):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
```

## Installation

```bash
cd backend
npm install
```

## Running the Server

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get student by ID |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courses | Get all courses |
| GET | /api/courses/:id | Get course by ID |
| POST | /api/courses | Create course |
| PUT | /api/courses/:id | Update course |
| DELETE | /api/courses/:id | Delete course |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/enrollments | Get all enrollments |
| GET | /api/enrollments/:id | Get enrollment by ID |
| POST | /api/enrollments | Create enrollment |
| DELETE | /api/enrollments/:id | Delete enrollment |

## Request/Response Examples

### Create Student
```json
POST /api/students
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### Create Course
```json
POST /api/courses
{
  "name": "Introduction to Programming",
  "description": "Learn programming basics",
  "credits": 3,
  "instructor": "Dr. Smith"
}
```

### Create Enrollment
```json
POST /api/enrollments
{
  "student_id": 1,
  "course_id": 1
}
```

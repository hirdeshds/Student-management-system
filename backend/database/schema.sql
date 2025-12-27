-- Student Management System Database Schema

CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  credits INT DEFAULT 3,
  instructor VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enrollments table (junction table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- Sample data (optional)
INSERT INTO students (name, email, phone, address) VALUES
  ('Alice Johnson', 'alice@example.com', '+1234567890', '123 Main St, City'),
  ('Bob Smith', 'bob@example.com', '+0987654321', '456 Oak Ave, Town'),
  ('Charlie Brown', 'charlie@example.com', '+1122334455', '789 Pine Rd, Village');

INSERT INTO courses (name, description, credits, instructor) VALUES
  ('Introduction to Computer Science', 'Learn the fundamentals of computer science', 3, 'Dr. Alan Turing'),
  ('Data Structures', 'Advanced data structures and algorithms', 4, 'Dr. Grace Hopper'),
  ('Web Development', 'Full-stack web development with modern technologies', 3, 'Prof. Tim Berners-Lee');

INSERT INTO enrollments (student_id, course_id) VALUES
  (1, 1),
  (1, 2),
  (2, 1),
  (2, 3),
  (3, 2),
  (3, 3);

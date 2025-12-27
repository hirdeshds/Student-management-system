const db = require('../db');

// Get all enrollments with student and course details
exports.getAllEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.enrollment_id,
        s.student_id,
        s.name AS student_name,
        s.email AS student_email,
        c.course_id,
        c.course_name,
        c.credit_hours
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      ORDER BY e.enrollment_id DESC
    `);

    const formattedRows = rows.map(row => ({
      enrollment_id: row.enrollment_id,
      student: {
        student_id: row.student_id,
        name: row.student_name,
        email: row.student_email
      },
      course: {
        course_id: row.course_id,
        course_name: row.course_name,
        credit_hours: row.credit_hours
      }
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.enrollment_id,
        s.student_id,
        s.name AS student_name,
        s.email AS student_email,
        c.course_id,
        c.course_name,
        c.credit_hours
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.enrollment_id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const row = rows[0];

    res.json({
      enrollment_id: row.enrollment_id,
      student: {
        student_id: row.student_id,
        name: row.student_name,
        email: row.student_email
      },
      course: {
        course_id: row.course_id,
        course_name: row.course_name,
        credit_hours: row.credit_hours
      }
    });
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ message: 'Error fetching enrollment' });
  }
};

// Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({ message: 'Student ID and Course ID are required' });
    }

    // Check student
    const [student] = await db.query(
      'SELECT student_id FROM students WHERE student_id = ?',
      [student_id]
    );
    if (student.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check course
    const [course] = await db.query(
      'SELECT course_id FROM courses WHERE course_id = ?',
      [course_id]
    );
    if (course.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Prevent duplicate enrollment
    const [existing] = await db.query(
      'SELECT enrollment_id FROM enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, course_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    const [result] = await db.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, course_id]
    );

    res.status(201).json({
      enrollment_id: result.insertId,
      student_id,
      course_id
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ message: 'Error creating enrollment' });
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT enrollment_id FROM enrollments WHERE enrollment_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    await db.query(
      'DELETE FROM enrollments WHERE enrollment_id = ?',
      [id]
    );

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ message: 'Error deleting enrollment' });
  }
};

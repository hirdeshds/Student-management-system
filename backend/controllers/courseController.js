const db = require('../db');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM courses ORDER BY course_id DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM courses WHERE course_id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { course_name, credit_hours } = req.body;

    if (!course_name) {
      return res.status(400).json({ message: 'Course name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO courses (course_name, credit_hours) VALUES (?, ?)',
      [course_name, credit_hours || null]
    );

    const [newCourse] = await db.query(
      'SELECT * FROM courses WHERE course_id = ?',
      [result.insertId]
    );

    res.status(201).json(newCourse[0]);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { course_name, credit_hours } = req.body;
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT * FROM courses WHERE course_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await db.query(
      'UPDATE courses SET course_name = ?, credit_hours = ? WHERE course_id = ?',
      [
        course_name || existing[0].course_name,
        credit_hours !== undefined ? credit_hours : existing[0].credit_hours,
        id
      ]
    );

    const [updatedCourse] = await db.query(
      'SELECT * FROM courses WHERE course_id = ?',
      [id]
    );

    res.json(updatedCourse[0]);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT * FROM courses WHERE course_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await db.query(
      'DELETE FROM courses WHERE course_id = ?',
      [id]
    );

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
};

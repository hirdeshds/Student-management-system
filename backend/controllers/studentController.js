const db = require('../db');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM students ORDER BY student_id DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM students WHERE student_id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student' });
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const [result] = await db.query(
      'INSERT INTO students (name, email, contact) VALUES (?, ?, ?)',
      [name, email, contact || null]
    );

    const [newStudent] = await db.query(
      'SELECT * FROM students WHERE student_id = ?',
      [result.insertId]
    );

    res.status(201).json(newStudent[0]);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student' });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, contact } = req.body;
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT * FROM students WHERE student_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await db.query(
      'UPDATE students SET name = ?, email = ?, contact = ? WHERE student_id = ?',
      [
        name || existing[0].name,
        email || existing[0].email,
        contact !== undefined ? contact : existing[0].contact,
        id
      ]
    );

    const [updatedStudent] = await db.query(
      'SELECT * FROM students WHERE student_id = ?',
      [id]
    );

    res.json(updatedStudent[0]);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student' });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT * FROM students WHERE student_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await db.query(
      'DELETE FROM students WHERE student_id = ?',
      [id]
    );

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student' });
  }
};

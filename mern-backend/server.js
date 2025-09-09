// MERN Backend Reference - Node.js/Express Server
// This file shows the backend structure for the MERN stack application

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-rbac', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  }
}, {
  timestamps: true
});

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// AUTH ROUTES

// Register
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // If student role, create student profile
    if (role === 'student') {
      const student = new Student({
        name,
        email,
        course: 'MERN Bootcamp', // Default course
        userId: user._id
      });
      await student.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// STUDENT ROUTES

// Get all students (Admin only)
app.get('/api/students', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student profile (Student can get own profile)
app.get('/api/students/profile', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student (Admin only)
app.post('/api/students', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, course } = req.body;

    const student = new Student({
      name,
      email,
      course,
      userId: req.user._id // This should be the actual student's user ID in production
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student (Admin can update any, Student can update own)
app.put('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && student.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, course },
      { new: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student (Admin only)
app.delete('/api/students/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
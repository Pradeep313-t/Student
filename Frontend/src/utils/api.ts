import axios from 'axios';
import { User, Student } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API responses for demonstration (replace with real API calls)
const mockUsers: User[] = [
  { _id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' },
  { _id: '2', name: 'John Student', email: 'john@example.com', role: 'student', createdAt: '2024-01-02' }
];

const mockStudents: Student[] = [
  { _id: '1', name: 'John Student', email: 'john@example.com', course: 'MERN Bootcamp', enrollmentDate: '2024-01-15', userId: '2' },
  { _id: '2', name: 'Jane Smith', email: 'jane@example.com', course: 'Full Stack Development', enrollmentDate: '2024-01-20', userId: '3' },
  { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', course: 'React Masterclass', enrollmentDate: '2024-01-25', userId: '4' }
];

export const authApi = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw { response: { data: { message: 'Invalid credentials' } } };
    }
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user
    };
  },

  signup: async (name: string, email: string, password: string, role: 'admin' | 'student') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw { response: { data: { message: 'User already exists' } } };
    }
    
    const newUser: User = {
      _id: String(Date.now()),
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // If the user is a student, create a corresponding student profile
    if (role === 'student') {
      const newStudent: Student = {
        _id: String(Date.now() + 1), // Ensure unique ID
        name,
        email,
        course: 'Not Assigned',
        enrollmentDate: new Date().toISOString().split('T')[0],
        userId: newUser._id
      };
      mockStudents.push(newStudent);
    }
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: newUser
    };
  },

  verifyToken: async (token: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock token verification
    if (token.startsWith('mock-jwt-token-')) {
      return { user: mockUsers[0] }; // Return first user as default
    }
    
    throw new Error('Invalid token');
  }
};

export const studentApi = {
  getAllStudents: async (): Promise<Student[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStudents;
  },

  getStudentProfile: async (userId: string): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const student = mockStudents.find(s => s.userId === userId);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  },

  createStudent: async (studentData: Omit<Student, '_id'>): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStudent: Student = {
      _id: String(Date.now()),
      ...studentData
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  updateStudent: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStudents.findIndex(s => s._id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    mockStudents[index] = { ...mockStudents[index], ...studentData };
    return mockStudents[index];
  },

  deleteStudent: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStudents.findIndex(s => s._id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    mockStudents.splice(index, 1);
  }
};

export default api;
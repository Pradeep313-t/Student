import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { studentApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, Mail, User, Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../components/Layout';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  });

  useEffect(() => {
    if (user) {
      loadStudentProfile();
    }
  }, [user]);

  const loadStudentProfile = async () => {
    try {
      if (user) {
        const data = await studentApi.getStudentProfile(user._id);
        setStudent(data);
        setFormData({
          name: data.name,
          email: data.email,
          course: data.course
        });
      }
    } catch (error) {
      console.error('Failed to load student profile:', error);
      // Create a mock student profile if not found
      const mockStudent: Student = {
        _id: String(Date.now()),
        name: user?.name || '',
        email: user?.email || '',
        course: 'MERN Bootcamp',
        enrollmentDate: new Date().toISOString(),
        userId: user?._id || ''
      };
      setStudent(mockStudent);
      setFormData({
        name: mockStudent.name,
        email: mockStudent.email,
        course: mockStudent.course
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) return;
    
    try {
      const updatedStudent = await studentApi.updateStudent(student._id, formData);
      setStudent(updatedStudent);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        course: student.course
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Student profile not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 text-emerald-600 mr-3" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your student profile and course information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{student.name}</h2>
                  <p className="text-emerald-100 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {student.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Full Name</span>
                    </div>
                    <p className="text-lg text-gray-900">{student.name}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Mail className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Email Address</span>
                    </div>
                    <p className="text-lg text-gray-900">{student.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Current Course</span>
                    </div>
                    <p className="text-lg text-gray-900">{student.course}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Enrollment Date</span>
                    </div>
                    <p className="text-lg text-gray-900">
                      {format(new Date(student.enrollmentDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
          <div className="text-gray-600 space-y-2">
            <p>Welcome to your student dashboard! Here you can:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>View and update your personal profile information</li>
              <li>Track your course enrollment details</li>
              <li>Keep your contact information up to date</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
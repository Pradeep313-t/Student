import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentRoute = location.pathname.startsWith('/student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.role === 'admin' ? (
                  <Users className="w-6 h-6 text-blue-600" />
                ) : (
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                )}
                <h1 className="text-xl font-bold text-gray-900">
                  {user.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                  {user.role}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
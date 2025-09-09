export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  createdAt: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: 'admin' | 'student') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'student';
}
# MERN Stack RBAC Project Setup Instructions

## Overview
This is a complete MERN (MongoDB, Express, React, Node.js) stack application with Role-Based Access Control (RBAC) featuring:
- JWT Authentication
- Admin and Student roles
- Dashboard CRUD operations
- Beautiful, responsive UI

## Frontend (React) - Already Running
The React frontend is already set up in this environment with:
- ✅ Authentication Context with JWT
- ✅ Protected Routes with role-based access
- ✅ Login/Signup pages with beautiful UI
- ✅ Admin Dashboard for student management
- ✅ Student Dashboard for profile management
- ✅ Mock API integration (ready for real backend)

### Frontend Features:
- Modern, responsive design with Tailwind CSS
- Glass morphism effects and smooth animations
- Form validation and error handling
- Role-based navigation and access control
- CRUD operations for student management (Admin)
- Profile management (Student)

## Backend Setup (Node.js/Express)

### 1. Create Backend Directory
```bash
mkdir mern-rbac-backend
cd mern-rbac-backend
```

### 2. Initialize Node.js Project
```bash
npm init -y
```

### 3. Install Dependencies
```bash
npm install express mongoose cors bcryptjs jsonwebtoken dotenv
npm install -D nodemon
```

### 4. Create Project Structure
```
mern-rbac-backend/
├── server.js
├── package.json
├── .env
├── models/
│   ├── User.js
│   └── Student.js
├── routes/
│   ├── auth.js
│   └── students.js
├── middleware/
│   └── auth.js
└── controllers/
    ├── authController.js
    └── studentController.js
```

### 5. Environment Variables
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/mern-rbac
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 6. Database Setup (MongoDB)
Make sure MongoDB is running locally, or use MongoDB Atlas:
```bash
# Local MongoDB (if installed)
mongod

# Or use MongoDB Atlas cloud database
# Create account at https://cloud.mongodb.com
# Create cluster and get connection string
```

### 7. Start Backend Server
```bash
npm run dev
```

## Connecting Frontend to Backend

### 1. Update API Configuration
In the frontend, update `src/utils/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 2. Remove Mock API Implementation
Replace the mock functions in `src/utils/api.ts` with real API calls to your backend.

## Running the Complete Application

### Terminal 1 - Backend
```bash
cd mern-rbac-backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd mern-rbac-frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing the Application

### Demo Accounts
1. **Admin Account**:
   - Email: admin@example.com
   - Password: admin123
   - Access: Full student management

2. **Student Account**:
   - Email: john@example.com
   - Password: student123
   - Access: Personal profile management

### Admin Features:
- View all students in a beautiful dashboard
- Add new students with course information
- Edit existing student records
- Delete students
- Search and filter functionality
- Statistics and analytics

### Student Features:
- View personal profile information
- Update name, email, and course details
- View enrollment date and course progress
- Clean, focused interface

## Production Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
npm run build
# Deploy dist folder to your hosting service
```

### Backend Deployment (Railway/Render/Heroku)
1. Update environment variables
2. Use production MongoDB Atlas database
3. Configure CORS for production domain
4. Deploy using your preferred service

## Security Best Practices
- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Environment variables for secrets

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Students (Protected)
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/profile` - Get own profile (Student)
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/:id` - Update student (Admin/Own profile)
- `DELETE /api/students/:id` - Delete student (Admin only)

## Next Steps & Enhancements
- Email verification system
- Password reset functionality
- File upload for profile pictures
- Advanced search and filtering
- Real-time notifications
- Course management system
- Grading and assignment features

The frontend is already production-ready with beautiful design and full functionality. Simply set up the backend following these instructions to have a complete MERN stack application!
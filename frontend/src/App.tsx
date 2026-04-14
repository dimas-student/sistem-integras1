import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';
import CourseCatalog from './pages/courses/Catalog';
import CourseDetail from './pages/courses/CourseDetail';
import LessonPlayer from './pages/learning/LessonPlayer';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />

          {/* Private Routes */}
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <CourseCatalog />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <PrivateRoute>
                <CourseDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/learning/:courseId/:lessonId"
            element={
              <PrivateRoute>
                <LessonPlayer />
              </PrivateRoute>
            }
          />

          {/* Default Route - redirect to signup */}
          <Route path="/" element={<Navigate to="/auth/signup" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

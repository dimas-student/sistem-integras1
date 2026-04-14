import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="p-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
      <div className="container flex-between">
        <div className="flex-center gap-3">
          <h2 style={{ margin: 0, color: '#6366f1' }}>📚 LMS</h2>
        </div>

        <div className="flex-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-muted">Welcome, {user?.firstName}!</span>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn-outline btn-small"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/courses')} 
                className="btn-outline btn-small"
              >
                Courses
              </button>
              <button 
                onClick={handleLogout} 
                className="btn-primary btn-small"
                style={{ width: 'auto' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/auth/login')} 
                className="btn-outline btn-small"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/auth/signup')} 
                className="btn-primary btn-small"
                style={{ width: 'auto' }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

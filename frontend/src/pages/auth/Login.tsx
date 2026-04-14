import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import Navigation from '../../components/Navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Navigation />
      <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center mb-4">Welcome Back</h1>
            <p className="text-center text-muted mb-4">
              Sign in to your account to continue learning
            </p>

            {error && (
              <div className="alert alert-error mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-column gap-3">
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '⏳ Signing in...' : '🔓 Login'}
              </button>
            </form>

            <div className="alert alert-info mt-4">
              <strong>Demo Credentials:</strong><br/>
              Email: learner@example.com<br/>
              Password: password123
            </div>

            <p className="text-center mt-4">
              Don't have an account?{' '}
              <a href="/auth/signup" style={{ color: '#6366f1', fontWeight: '600' }}>
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

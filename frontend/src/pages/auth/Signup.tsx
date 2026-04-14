import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useAuth';
import Navigation from '../../components/Navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signupUser, loading, error } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signupUser(email, password, firstName, lastName);
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
            <h1 className="text-center mb-4">Create Your Account</h1>
            
            {error && (
              <div className="alert alert-error mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-column gap-3">
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

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
                {loading ? '⏳ Creating account...' : '✨ Sign Up'}
              </button>
            </form>

            <p className="text-center mt-4">
              Already have an account?{' '}
              <a href="/auth/login" style={{ color: '#6366f1', fontWeight: '600' }}>
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

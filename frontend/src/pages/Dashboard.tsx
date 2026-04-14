import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEnrollment } from '../hooks/useEnroll';
import type { Enrollment } from '../types/index';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserEnrollments } = useEnrollment();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (user) {
        const data = await getUserEnrollments(user.id);
        setEnrollments(data);
      }
      setLoading(false);
    };
    load();
  }, [user, getUserEnrollments]);

  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <div className="mb-5">
          <h1>👋 Welcome, {user?.firstName}!</h1>
          <p className="text-muted">Here's your learning dashboard</p>
        </div>

        <div className="grid grid-2 mb-5">
          <div className="card">
            <div className="card-body text-center">
              <h3 style={{ fontSize: '3rem', margin: 0 }}>
                {enrollments.length}
              </h3>
              <p className="text-muted">Courses Enrolled</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <h3 style={{ fontSize: '3rem', margin: 0 }}>
                {enrollments.filter(e => e.status === 'COMPLETED').length}
              </h3>
              <p className="text-muted">Courses Completed</p>
            </div>
          </div>
        </div>

        <h2 className="mb-3">📚 My Courses</h2>
        {loading ? (
          <div className="card p-3 text-center">
            <p className="text-muted">⏳ Loading your courses...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="card p-4 text-center">
            <p className="text-muted mb-3">You haven't enrolled in any courses yet.</p>
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary btn-small"
              style={{ width: 'auto' }}
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-2">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="card">
                <div className="card-body">
                  <h3>{enrollment.course.title}</h3>
                  <p className="text-muted">{enrollment.course.description}</p>
                  
                  <div className="mt-3">
                    <div className="flex-between mb-2">
                      <span className="text-muted">Progress</span>
                      <span className="font-semibold">{enrollment.status}</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: enrollment.status === 'COMPLETED' ? '100%' : '25%',
                        backgroundColor: enrollment.status === 'COMPLETED' ? '#10b981' : '#6366f1',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                      className="btn-outline btn-small"
                      style={{ width: '100%' }}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 text-center">
          <button
            onClick={() => navigate('/courses')}
            className="btn-primary"
            style={{ width: 'auto' }}
          >
            Browse More Courses
          </button>
        </div>
      </div>
    </>
  );
}

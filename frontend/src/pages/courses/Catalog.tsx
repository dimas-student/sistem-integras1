import { useEffect } from 'react';
import { useCourses } from '../../hooks/useCourse';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';

export default function CourseCatalog() {
  const { courses, loading, fetchCourses } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <div className="text-center mb-5">
          <h1>📚 Available Courses</h1>
          <p className="text-muted">Choose a course and start your learning journey</p>
        </div>

        {loading ? (
          <div className="text-center p-4">
            <p>⏳ Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="card text-center p-4">
            <p className="text-muted">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="card-body">
                  <h3>{course.title}</h3>
                  <p className="text-muted">{course.description}</p>
                  
                  <div className="flex-between mt-3">
                    <span className="text-muted">
                      👨‍🏫 {course.instructor.firstName} {course.instructor.lastName}
                    </span>
                  </div>

                  <div className="flex-between mt-2 mb-3">
                    <span className="text-muted">
                      📖 {course._count?.lessons || 0} lessons
                    </span>
                    <span className="text-muted">
                      👥 {course._count?.enrollments || 0} students
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="btn-primary btn-small"
                    style={{ width: '100%' }}
                  >
                    View Course →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

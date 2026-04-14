import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourse';
import { useEnrollment } from '../../hooks/useEnroll';
import { useAuth } from '../../context/AuthContext';
import type { Course as CourseType } from '../../types/index';

export default function CourseDetail() {
  const { id } = useParams();
  const { fetchCourseById } = useCourses();
  const { enrollCourse } = useEnrollment();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await fetchCourseById(id);
        setCourse(data);
      }
      setLoading(false);
    };
    load();
  }, [id, fetchCourseById]);

  const handleEnroll = async () => {
    if (id) {
      const result = await enrollCourse(id);
      if (result.success) {
        setEnrolled(true);
        alert('Enrolled successfully!');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>
        <strong>Instructor:</strong> {course.instructor.firstName} {course.instructor.lastName}
      </p>
      <p>
        <strong>Lessons:</strong> {course.lessons?.length || 0}
      </p>

      {user && !enrolled && (
        <button onClick={handleEnroll} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Enroll Now
        </button>
      )}

      {enrolled && (
        <div style={{ color: 'green' }}>
          <p>✓ You are enrolled in this course</p>
          <a href={`/learning/${course.id}/0`} style={{ color: 'blue' }}>
            Start Learning
          </a>
        </div>
      )}

      <h3>Lessons:</h3>
      <ul>
        {course.lessons?.map((lesson, idx) => (
          <li key={lesson.id}>
            {idx + 1}. {lesson.title} ({lesson.duration} min)
          </li>
        ))}
      </ul>
    </div>
  );
}

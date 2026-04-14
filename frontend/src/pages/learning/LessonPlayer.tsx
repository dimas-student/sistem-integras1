import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLessonById } from '../../hooks/useCourse';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../context/AuthContext';
import type { Lesson as LessonType } from '../../types/index';

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const { lesson, loading, fetchLesson } = useLessonById(lessonId);
  const { updateProgress } = useProgress();
  const { user } = useAuth();
  const [watchedTime, setWatchedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId, fetchLesson]);

  const handleComplete = async () => {
    if (user && lessonId) {
      await updateProgress(lessonId, watchedTime, true);
      setIsCompleted(true);
      alert('Lesson marked as complete!');
    }
  };

  if (loading) return <div>Loading lesson...</div>;
  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>

      {lesson.contentUrl && (
        <div style={{ marginBottom: '20px' }}>
          <video
            width="100%"
            height="400"
            controls
            onTimeUpdate={(e) => setWatchedTime(Math.round(e.currentTarget.currentTime))}
            style={{ borderRadius: '8px', backgroundColor: '#000' }}
          >
            <source src={lesson.contentUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <p>
          <strong>Duration:</strong> {lesson.duration} minutes
        </p>
        <p>
          <strong>Watched:</strong> {watchedTime} seconds
        </p>
      </div>

      <button
        onClick={handleComplete}
        disabled={isCompleted}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isCompleted ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isCompleted ? 'default' : 'pointer',
        }}
      >
        {isCompleted ? '✓ Completed' : 'Mark as Complete'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <a href={`/learning/${courseId}/${parseInt(lessonId || '0') + 1}`} style={{ color: 'blue', marginRight: '20px' }}>
          Next Lesson →
        </a>
        <a href={`/courses/${courseId}`} style={{ color: 'blue' }}>
          Back to Course
        </a>
      </div>
    </div>
  );
}

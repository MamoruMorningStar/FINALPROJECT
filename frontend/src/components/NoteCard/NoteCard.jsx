import styles from './NoteCard.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Button from '../Button/Button';

export default function NoteCard({ id, title, content, created_at }) {
  const token = useSelector(state => state.user.token);
  const username = useSelector(state => state.user.username);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    axios.get(`http://localhost:8000/notes/${id}/comments`)
      .then(res => {
        if (isMounted) setComments(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setComments([]));
    return () => { isMounted = false; };
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError('');
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/notes/${id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prev => [...prev, res.data]);
      setComment('');
    } catch {
      setError('Ошибка добавления комментария.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <span className={styles.date}>{created_at ? new Date(created_at).toLocaleString() : ''}</span>
      </div>
      <div className={styles.content}>{content}</div>
      <div className={styles.commentsSection}>
        <h4>Комментарии</h4>
        {(!comments || comments.length === 0) && <div className={styles.noComments}>Комментариев нет</div>}
        <ul className={styles.commentsList}>
          {(comments || []).map(c => (
            <li key={c.id || Math.random()} className={styles.commentItem}>
              <span className={styles.commentUser}>Пользователь #{c.user_id || '?'}</span>: {c.content}
              <span className={styles.commentDate}>{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
            </li>
          ))}
        </ul>
        {token && (
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <input
              type="text"
              placeholder="Добавить комментарий..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={200}
              disabled={loading}
              className={styles.commentInput}
            />
            <Button type="submit" disabled={loading || !comment.trim()} style={{ marginLeft: 8 }}>
              Отправить
            </Button>
          </form>
        )}
        {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
      </div>
    </div>
  );
} 
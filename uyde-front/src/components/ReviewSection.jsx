import React, { useEffect, useState } from 'react';

export default function ReviewSection({ token, postId, currentUserId, postOwnerId }) {
    const [reviews, setReviews] = useState([]);
    const [text, setText] = useState('');
    const [rating, setRating] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [editRating, setEditRating] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Token ${token}`;

        fetch(`http://localhost:8000/api/posts/${postId}/reviews/`, { headers })
            .then(res => {
                if (!res.ok) throw new Error("Ошибка загрузки отзывов");
                return res.json();
            })
            .then(data => {
                setReviews(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [postId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const response = await fetch(`http://localhost:8000/api/posts/${postId}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ text, rating: Number(rating) }),
        });

        const data = await response.json();

        if (response.ok) {
            setReviews(prev => [...prev, data]);
            setText('');
            setRating('');
            setSuccess('✅ Отзыв успешно добавлен');
        } else {
            const allErrors = Object.entries(data)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('; ');
            setError(allErrors || 'Ошибка при отправке отзыва');
        }
    };

    const handleUpdate = async (reviewId) => {
        const res = await fetch(`http://localhost:8000/api/posts/${postId}/reviews/${reviewId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ text: editText, rating: Number(editRating) }),
        });
        const data = await res.json();
        if (res.ok) {
            setReviews(reviews.map(r => (r.id === reviewId ? data : r)));
            setSuccess('✅ Отзыв обновлён');
            setEditingId(null);
        } else {
            setError(data.detail || 'Ошибка при обновлении');
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Удалить отзыв?")) return;

        const res = await fetch(`http://localhost:8000/api/posts/${postId}/reviews/${reviewId}/`, {
            method: 'DELETE',
            headers: { Authorization: `Token ${token}` },
        });

        if (res.ok) {
            setReviews(reviews.filter(r => r.id !== reviewId));
            setSuccess('✅ Отзыв удалён');
        } else {
            setError('Ошибка при удалении отзыва');
        }
    };

    if (loading) return <p>Загрузка отзывов...</p>;

    return (
        <div className="mt-4">
            <h4>Отзывы</h4>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {reviews.length === 0 ? (
                <p className="text-muted">Пока нет отзывов.</p>
            ) : (
                <ul className="list-group mb-4">
                    {reviews.map(review => (
                        <li key={review.id} className="list-group-item">
                            {editingId === review.id ? (
                                <>
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        min="1"
                                        max="5"
                                        value={editRating}
                                        onChange={(e) => setEditRating(e.target.value)}
                                    />
                                    <textarea
                                        className="form-control mb-2"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                    ></textarea>
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() => handleUpdate(review.id)}
                                    >
                                        💾 Сохранить
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setEditingId(null)}
                                    >
                                        ❌ Отмена
                                    </button>
                                </>
                            ) : (
                                <>
                                    <strong>{review.author_username}</strong> – ⭐ {review.rating}<br />
                                    {review.text}
                                    <div className="text-muted small">{new Date(review.created_at).toLocaleString()}</div>

                                    {review.author === currentUserId && (
                                        <div className="mt-2 d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => {
                                                    setEditingId(review.id);
                                                    setEditText(review.text);
                                                    setEditRating(review.rating);
                                                }}
                                            >
                                                ✏️ Редактировать
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(review.id)}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {currentUserId !== postOwnerId && token && (
                <div className="mt-4">
                    <h5>📝 Добавить отзыв</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">Оценка (1–5):</label>
                            <input
                                type="number"
                                className="form-control"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Ваш отзыв:</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Отправить отзыв</button>
                    </form>
                </div>
            )}

            {currentUserId === postOwnerId && (
                <p className="text-muted fst-italic">Вы не можете оставлять отзыв под своим постом.</p>
            )}
        </div>
    );
}

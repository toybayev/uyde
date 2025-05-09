import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

const PostDetail = ({ token, user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (!window.confirm("Удалить объявление?")) return;
        try {
            const response = await fetch(`http://localhost:8000/api/posts/${post.id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.status === 204) {
                alert("✅ Объявление удалено");
                navigate("/posts");
            } else {
                throw new Error("Ошибка удаления");
            }
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Token ${token}`;

        fetch(`http://localhost:8000/api/posts/${id}/`, {
            method: "GET",
            headers,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Не удалось загрузить объявление");
                return res.json();
            })
            .then((data) => setPost(data))
            .catch((err) => setError(err.message));
    }, [id, token]);

    if (error) {
        return <div className="alert alert-danger mt-4 text-center">{error}</div>;
    }

    if (!post) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-3">{post.title || "Без названия"}</h2>
                <p className="text-muted mb-4">{post.description || "Без описания"}</p>

                <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"><strong>Город:</strong> {post.city}</li>
                    <li className="list-group-item"><strong>Адрес:</strong> {post.address}</li>
                    <li className="list-group-item"><strong>Цена:</strong> {post.price} ₸</li>
                    <li className="list-group-item"><strong>Комнат:</strong> {post.rooms}</li>
                    <li className="list-group-item"><strong>Создано:</strong> {new Date(post.created_at).toLocaleDateString()}</li>
                    <li className="list-group-item">
                        <strong>Владелец:</strong> {post.owner?.full_name || `Пользователь ID ${post.owner?.id || 'неизвестен'}`}
                    </li>
                </ul>

                <div className="text-end text-muted fst-italic">ID: {post.id}</div>

                {token && post.owner?.id === user?.id && (
                    <div className="mt-3 d-flex gap-2">
                        <button
                            onClick={() => navigate(`/posts/${post.id}/edit`)}
                            className="btn btn-warning"
                        >
                            ✏️ Редактировать
                        </button>

                        <button
                            onClick={handleDelete}
                            className="btn btn-danger"
                        >
                            🗑️ Удалить
                        </button>
                    </div>
                )}

                <div className="mt-4">
                    <h5>Добавить в избранное</h5>
                    <FavoriteButton
                        userPk={user?.id}
                        postPk={post.id}
                        token={token}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;

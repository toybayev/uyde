import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Profile({ token, user }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!user || !token) return;

        fetch(`https://uyde.ru/api/users/${user.id}/posts/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch user's posts");
                return res.json();
            })
            .then(data => setPosts(data))
            .catch(err => alert(err.message));
    }, [user, token]);

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    Пожалуйста, войдите в систему, чтобы просмотреть профиль.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-sm">
                <h2 className="mb-3">👤 Профиль пользователя: <span className="text-primary">{user.username}</span></h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Телефон:</strong> {user.phone}</p>
            </div>

            <div className="mt-5">
                <h3 className="mb-3">📋 Мои объявления</h3>

                {posts.length === 0 ? (
                    <div className="alert alert-info text-center">
                        Вы ещё не создавали объявлений.
                    </div>
                ) : (
                    <div className="row g-4">
                        {posts.map(post => (
                            <div className="col-md-4" key={post.id}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">
                                            <Link to={`/posts/${post.id}`} className="text-decoration-none text-dark">
                                                {post.title || "Без названия"}
                                            </Link>
                                        </h5>
                                        <p className="card-text text-muted mb-2">
                                            {post.description?.slice(0, 100) || "Без описания"}...
                                        </p>
                                        <ul className="list-unstyled small text-muted mb-3">
                                            <li><strong>Город:</strong> {post.city}</li>
                                            <li><strong>Комнат:</strong> {post.rooms}</li>
                                            <li><strong>Цена:</strong> {post.price} ₸</li>
                                        </ul>
                                        <Link to={`/posts/${post.id}`} className="btn btn-outline-primary mt-auto w-100">
                                            Подробнее
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

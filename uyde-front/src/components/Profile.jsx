import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Profile({ token, user }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!user || !token) return;

        fetch(`http://localhost:8000/api/users/${user.id}/posts/`, {
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
        return <p>Please log in to view your profile.</p>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-3">👤 Профиль: {user.username}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Full Name:</strong> {user.full_name}</p>
            <p><strong>Phone:</strong> {user.phone}</p>

            <h3 className="mt-5 mb-3">📝 Мои объявления</h3>
            {posts.length === 0 ? (
                <p className="text-muted">Вы ещё не создавали объявлений.</p>
            ) : (
                <div className="row g-4">
                    {posts.map(post => (
                        <div className="col-md-4" key={post.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link to={`/posts/${post.id}`} className="text-decoration-none text-dark">
                                            {post.title || "Без названия"}
                                        </Link>
                                    </h5>
                                    <p className="card-text">
                                        {post.description?.slice(0, 100) || "Без описания"}...
                                    </p>
                                    <p className="card-text">
                                        <strong>Город:</strong> {post.city} <br />
                                        <strong>Комнат:</strong> {post.rooms} <br />
                                        <strong>Цена:</strong> {post.price} ₸
                                    </p>
                                    <Link to={`/posts/${post.id}`} className="btn btn-primary btn-sm w-100 mt-2">Подробнее</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

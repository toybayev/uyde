import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PostsList = ({ token }) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        fetch("http://localhost:8000/api/posts/", {
            method: "GET",
            headers: headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [token]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
    if (error) return <div className="alert alert-danger text-center mt-4">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Список объявлений</h2>
            <div className="row g-4">
                {posts.length === 0 && (
                    <p className="text-muted text-center">Нет доступных объявлений.</p>
                )}
                {posts.map((post) => (
                    <div className="col-md-4" key={post.id}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to={`/posts/${post.id}`} className="text-decoration-none text-dark">
                                        {post.title || "Без названия"}
                                    </Link>
                                </h5>
                                <p className="card-text">{post.description?.slice(0, 100) || "Без описания"}...</p>
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
        </div>
    );
};

export default PostsList;

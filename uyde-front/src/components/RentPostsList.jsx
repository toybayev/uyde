import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function RentPostsList({ token }) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Token ${token}`;

        fetch("http://localhost:8000/api/posts/rent/", { headers })
            .then(res => {
                if (!res.ok) throw new Error("Ошибка загрузки аренды");
                return res.json();
            })
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Аренда недвижимости</h2>
            <div className="row g-4">
                {posts.map((post) => (
                    <div className="col-md-4" key={post.id}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.description}</p>
                                <p><strong>Цена:</strong> {post.price} ₸</p>
                                <Link to={`/posts/${post.id}`} className="btn btn-primary btn-sm">Подробнее</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

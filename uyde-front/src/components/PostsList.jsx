import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PostsList = ({ token }) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all | rent | sale

    useEffect(() => {
        setLoading(true);
        setError("");

        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let url = "http://localhost:8000/api/posts/";
        if (filter === "rent") url = "http://localhost:8000/api/posts/rent/";
        if (filter === "sale") url = "http://localhost:8000/api/posts/sale/";

        fetch(url, {
            method: "GET",
            headers: headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Не удалось загрузить объявления");
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
    }, [filter, token]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
    if (error) return <div className="alert alert-danger text-center mt-4">{error}</div>;

    const getFilterLabel = () => {
        if (filter === "rent") return " (Аренда)";
        if (filter === "sale") return " (Продажа)";
        return "";
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Список объявлений{getFilterLabel()}</h2>

            <div className="text-center mb-4">
                <button
                    className={`btn btn-outline-primary me-2 ${filter === "all" ? "active" : ""}`}
                    disabled={loading}
                    onClick={() => setFilter("all")}
                >
                    Все
                </button>
                <button
                    className={`btn btn-outline-success me-2 ${filter === "rent" ? "active" : ""}`}
                    disabled={loading}
                    onClick={() => setFilter("rent")}
                >
                    Снять
                </button>
                <button
                    className={`btn btn-outline-warning ${filter === "sale" ? "active" : ""}`}
                    disabled={loading}
                    onClick={() => setFilter("sale")}
                >
                    Купить
                </button>
            </div>

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
                                <Link to={`/posts/${post.id}`} className="btn btn-primary btn-sm w-100 mt-2">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostsList;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = ({ token }) => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        fetch(`http://localhost:8000/api/posts/${id}/`, {
            method: "GET",
            headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Не удалось загрузить объявление");
                }
                return response.json();
            })
            .then((data) => setPost(data))
            .catch((error) => setError(error.message));
    }, [id, token]);

    if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;
    if (!post) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

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
                    <li className="list-group-item"><strong>Владелец:</strong> {post.owner?.username || `ID: ${post.owner}`}</li>
                </ul>

                <div className="text-end text-muted fst-italic">ID: {post.id}</div>
            </div>
        </div>
    );
};

export default PostDetail;

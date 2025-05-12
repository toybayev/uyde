import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FavoritesList = ({ userPk, token }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`https://uyde.ru/api/users/${userPk}/favorites/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error("Ошибка при загрузке избранных");

                const data = await response.json();
                setFavorites(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userPk && token) {
            fetchFavorites();
        }
    }, [userPk, token]);

    if (loading) return <div className="text-center mt-5">Загрузка избранных...</div>;
    if (error) return <div className="alert alert-danger mt-5 text-center">{error}</div>;
    if (favorites.length === 0) return <div className="text-center mt-5">Нет избранных объявлений.</div>;

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Избранные объявления</h3>
            <div className="row">
                {favorites.map(fav => (
                    <div className="col-md-4 mb-4" key={fav.id}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{fav.post.title}</h5>
                                <p className="text-muted">{fav.post.description}</p>
                                <p><strong>Город:</strong> {fav.post.city}</p>
                                <p><strong>Цена:</strong> {fav.post.price} ₸</p>
                                <p><strong>Комнат:</strong> {fav.post.rooms}</p>
                                <Link to={`/posts/${fav.post.id}`} className="btn btn-primary mt-2">
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

export default FavoritesList;

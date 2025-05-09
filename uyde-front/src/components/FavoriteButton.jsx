import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ userPk, postPk, token }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userPk || !postPk) return;

        const checkFavorite = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${userPk}/favorites/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const data = await response.json();
                const match = data.find(fav => fav.post?.id === postPk || fav.post === postPk);
                if (match) {
                    setIsFavorite(true);
                    setFavoriteId(match.id);
                } else {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        checkFavorite();
    }, [userPk, postPk, token]);

    const handleToggleFavorite = async () => {
        if (!postPk || !userPk) {
            setError("Некорректные данные избранного");
            return;
        }

        setLoading(true);
        try {
            if (isFavorite && favoriteId) {
                const response = await fetch(
                    `http://localhost:8000/api/users/${userPk}/favorites/${favoriteId}/`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error('Не удалось удалить из избранного');

                setIsFavorite(false);
                setFavoriteId(null);
            } else {
                const response = await fetch(
                    `http://localhost:8000/api/users/${userPk}/favorites/`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ post: postPk }),
                    }
                );

                if (!response.ok) throw new Error('Не удалось добавить в избранное');

                const data = await response.json();
                setIsFavorite(true);
                setFavoriteId(data.id);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button onClick={handleToggleFavorite} disabled={loading} className="btn btn-outline-danger">
                {loading
                    ? 'Сохраняю...'
                    : isFavorite
                        ? 'Убрать из избранного'
                        : 'Добавить в избранное'}
            </button>
            {error && <div className="text-danger mt-2">{error}</div>}
        </>
    );
};

export default FavoriteButton;

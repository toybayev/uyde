import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PostsList = ({ token }) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [retryAfter, setRetryAfter] = useState(null);
    const navigate = useNavigate();

    const fetchPosts = () => {
        setLoading(true);
        setError("");

        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        fetch("https://uyde.ru/api/posts/", {
            method: "GET",
            headers: headers,
        })
            .then((response) => {
                // Проверка на превышение лимита запросов (429)
                if (response.status === 429) {
                    // Получаем заголовок Retry-After, если он есть
                    const retryAfterHeader = response.headers.get('Retry-After');
                    const retrySeconds = retryAfterHeader ? parseInt(retryAfterHeader) : 60;
                    setRetryAfter(retrySeconds);
                    throw new Error(`Превышен лимит запросов. Пожалуйста, подождите ${retrySeconds} секунд перед следующей попыткой.`);
                }

                // Проверка на статус 401 - не авторизован
                if (response.status === 401) {
                    throw new Error("Для доступа к объявлениям необходима авторизация. Пожалуйста, войдите в систему.");
                }

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки объявлений: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
                setRetryAfter(null);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);

                // Если ошибка авторизации, можно предложить пользователю войти
                if (error.message.includes("необходима авторизация")) {
                    setTimeout(() => {
                        if (window.confirm("Перейти на страницу входа?")) {
                            navigate("/login");
                        }
                    }, 1000);
                }
            });
    };

    // Автоматическая повторная попытка после истечения времени ожидания
    useEffect(() => {
        let retryTimer;
        if (retryAfter) {
            retryTimer = setTimeout(() => {
                fetchPosts();
            }, retryAfter * 1000);
        }

        return () => {
            if (retryTimer) clearTimeout(retryTimer);
        };
    }, [retryAfter]);

    useEffect(() => {
        fetchPosts();
    }, [token]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Ошибка!</h4>
                    <p>{error}</p>
                    {error.includes("необходима авторизация") && (
                        <Link to="/login" className="btn btn-outline-danger mt-2">
                            Войти в систему
                        </Link>
                    )}
                    {error.includes("Превышен лимит запросов") && retryAfter && (
                        <div className="mt-3">
                            <p>Автоматическая повторная попытка через <strong>{retryAfter}</strong> секунд</p>
                            <div className="progress">
                                <div
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    style={{ width: "100%", transition: `width ${retryAfter}s linear` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

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
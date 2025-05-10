import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDetail = ({ token }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Не удалось загрузить пользователя");
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, [id, token]);

    if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;
    if (!user) return (
        <div className="text-center mt-5">
            <div className="spinner-border" role="status" />
        </div>
    );

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <div className="card-body">
                    <h3 className="card-title mb-4 text-center">👤 Профиль пользователя</h3>

                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <strong>👤 Username:</strong> {user.username}
                        </li>
                        <li className="list-group-item">
                            <strong>📧 Email:</strong> {user.email || "не указано"}
                        </li>

                        <li className="list-group-item">
                            <strong>📞 Телефон:</strong> {user.phone || "не указано"}
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;

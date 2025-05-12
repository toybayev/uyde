import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UsersList = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        fetch("https://uyde.ru/api/users/", {
            method: "GET",
            headers: headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                return response.json();
            })
            .then((data) => {
                setUsers(data);
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
            <h2 className="mb-4 text-center">👥 Список пользователей</h2>
            {users.length === 0 ? (
                <p className="text-muted text-center">Пользователи не найдены.</p>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {users.map(user => (
                        <div key={user.id} className="p-3 border rounded bg-light shadow-sm">
                            <h5 className="mb-1">
                                👤 <Link to={`/users/${user.id}`} className="text-decoration-none">
                                {user.username}
                            </Link>
                            </h5>
                            <p className="mb-0">
                                <strong>Full Name:</strong> {user.full_name || "N/A"}<br />
                                <strong>Email:</strong> {user.email}<br />
                                <strong>Phone:</strong> {user.phone || "N/A"}<br />
                                <strong>Role:</strong> {user.role || "user"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UsersList;

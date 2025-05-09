import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = ({ token }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        fetch(`http://localhost:8000/api/users/${id}/`, {
            method: "GET",
            headers: headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => setError(error.message));
    }, [id, token]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!user) return <p>Loading user...</p>;

    return (
        <div>
            <h2>User Detail</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default UserDetail;

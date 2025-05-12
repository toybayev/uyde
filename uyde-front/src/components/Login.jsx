import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login({ onLogin }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("https://uyde.ru/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            // Проверка на слишком много запросов (429)
            if (response.status === 429) {
                setError("⚠️ Слишком много попыток входа. Пожалуйста, подождите немного и попробуйте снова.");
                return;
            }

            const data = await response.json();

            if (response.ok) {
                const userRes = await fetch("https://uyde.ru/api/users/me/", {
                    headers: {
                        Authorization: `Token ${data.token}`,
                    },
                });
                const userData = await userRes.json();

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(userData));

                onLogin && onLogin(data.token, userData);
                alert("✅ Login successful!");
                navigate("/home");
            } else {
                setError(`❌ Error: ${data.error || "Login failed!"}`);
            }
        } catch (err) {
            setError("⚠️ Error sending form data: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Welcome Back 👋</h3>

                {/* Показываем сообщение об ошибке, если оно есть */}
                {error && (
                    <div className="alert alert-danger mb-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label"><FaUser className="me-2" />Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><FaLock className="me-2" />Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}
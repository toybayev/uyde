import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login({ onLogin }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                const userRes = await fetch("http://localhost:8000/api/users/me/", {
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
                alert(`❌ Error: ${data.error || "Login failed!"}`);
            }
        } catch {
            alert("⚠️ Error sending form data");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Welcome Back 👋</h3>
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

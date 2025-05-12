import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

export default function SignUp({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "", surname: "", email: "", phone: "", password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some(v => !v)) return alert("Please fill out all fields.");

        try {
            const res = await fetch("https://uyde.ru/api/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) return alert(`❌ ${data.detail || "Registration failed!"}`);
            alert("✅ Registration successful!");

            const loginRes = await fetch("https://uyde.ru/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: formData.username, password: formData.password }),
            });

            const loginData = await loginRes.json();

            if (loginRes.ok && loginData.token) {
                const userRes = await fetch("https://uyde.ru/api/users/me/", {
                    headers: {
                        Authorization: `Token ${loginData.token}`,
                    },
                });
                const userData = await userRes.json();

                localStorage.setItem("token", loginData.token);
                localStorage.setItem("user", JSON.stringify(userData));

                onLogin && onLogin(loginData.token, userData);
                alert("🔓 Logged in automatically!");
                navigate("/home");
            } else {
                alert("Registered, but failed to auto-login.");
            }
        } catch {
            alert("⚠️ Network error.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: "450px", width: "100%" }}>
                <h3 className="text-center mb-4">Create Account</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label"><FaUser className="me-2" />Username</label>
                        <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><FaUser className="me-2" />Surname</label>
                        <input type="text" name="surname" className="form-control" value={formData.surname} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><FaEnvelope className="me-2" />Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><FaPhone className="me-2" />Phone</label>
                        <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><FaLock className="me-2" />Password</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                    </div>
                    <button className="btn btn-success w-100" type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

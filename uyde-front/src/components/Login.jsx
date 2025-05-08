import React, { useState } from "react";

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                localStorage.setItem("token", data.token);
            } else {
                alert(`Error: ${data.error || "Login failed!"}`);
            }
        } catch (error) {
            console.error("Error sending form data:", error);
            alert("Error sending form data");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Write your username</label>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your username"
            />
            <a href=""></a>
            <br />
            <label>Write your password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
            />
            <br />
            <button type="submit">Login</button>
        </form>
    );
}

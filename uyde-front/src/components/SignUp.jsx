import React, { useState } from "react";

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        surname: "",
        email: "",
        phone: "",
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

        // Проверка на заполнение всех полей
        if (
            !formData.username ||
            !formData.surname ||
            !formData.email ||
            !formData.phone ||
            !formData.password
        ) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("You have successfully registered!");
            } else {
                alert(`Error: ${data.detail || "Registration failed!"}`);
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
            />
            <br />
            <label>Write your surname</label>
            <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
            />
            <br />
            <label>Write your email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
            <br />
            <label>Write your phone number</label>
            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
            />
            <br />
            <label>Create password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <br />
            <button type="submit">Sign up</button>
        </form>
    );
}

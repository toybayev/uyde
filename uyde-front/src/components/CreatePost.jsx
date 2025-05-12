import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ token }) {
    const navigate = useNavigate();
    const fileInputRef = useRef();

    const initialForm = {
        title: "",
        description: "",
        city: "",
        address: "",
        price: "",
        rooms: "",
        type: "rent_out",
    };

    const [form, setForm] = useState(initialForm);
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("https://uyde.ru/api/posts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    rooms: parseInt(form.rooms),
                    is_active: true,
                }),
            });

            if (!response.ok) throw new Error("Ошибка создания поста");
            const post = await response.json();

            for (let file of files) {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("post", post.id);

                const photoRes = await fetch(`https://localhost:8000/api/posts/${post.id}/photos/`, {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: formData,
                });

                if (!photoRes.ok) throw new Error("Ошибка загрузки фотографии");
            }

            setForm(initialForm);
            setFiles([]);
            fileInputRef.current.value = null;
            setMessage("✅ Объявление и фото успешно загружены!");
            navigate("/profile");
        } catch (err) {
            setMessage(`❌ ${err.message}`);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4 w-100" style={{ maxWidth: "600px" }}>
                <h3 className="mb-4 text-center">Создать новое объявление</h3>

                {message && (
                    <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { name: "title", label: "Название" },
                        { name: "description", label: "Описание" },
                        { name: "city", label: "Город" },
                        { name: "address", label: "Адрес" },
                        { name: "price", label: "Цена", type: "number" },
                        { name: "rooms", label: "Количество комнат", type: "number" },
                    ].map(({ name, label, type = "text" }) => (
                        <div className="mb-3" key={name}>
                            <label className="form-label">{label}</label>
                            <input
                                className="form-control"
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    <div className="mb-3">
                        <label className="form-label">Тип объявления</label>
                        <select
                            name="type"
                            className="form-select"
                            value={form.type}
                            onChange={handleChange}
                        >
                            <option value="rent_out">Сдам</option>
                            <option value="sell">Продам</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Фото (можно несколько)</label>
                        <input
                            type="file"
                            className="form-control"
                            multiple
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Создать</button>
                </form>
            </div>
        </div>
    );
}

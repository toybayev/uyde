import React, { useState } from 'react';

const CreatePost = ({ token }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        city: '',
        address: '',
        price: '',
        rooms: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        try {
            const response = await fetch('http://localhost:8000/api/posts/', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    rooms: parseInt(form.rooms),
                    is_active: true,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(JSON.stringify(errData));
            }

            setForm({
                title: '',
                description: '',
                city: '',
                address: '',
                price: '',
                rooms: '',
            });
            setMessage('✅ Объявление успешно создано!');
        } catch (err) {
            setMessage(`❌ Ошибка: ${err.message}`);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4 w-100" style={{ maxWidth: '600px' }}>
                <h3 className="mb-4 text-center">Создать новое объявление</h3>
                {message && (
                    <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {[
                        { name: 'title', label: 'Название' },
                        { name: 'description', label: 'Описание' },
                        { name: 'city', label: 'Город' },
                        { name: 'address', label: 'Адрес' },
                        { name: 'price', label: 'Цена', type: 'number' },
                        { name: 'rooms', label: 'Количество комнат', type: 'number' },
                    ].map(({ name, label, type = 'text' }) => (
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
                    <button type="submit" className="btn btn-primary w-100">Создать</button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;

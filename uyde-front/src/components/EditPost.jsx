import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(res => res.json())
      .then(setForm)
      .catch(() => setError("Ошибка загрузки"));
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("✅ Объявление обновлено");
        navigate(`/posts/${id}`);
      } else {
        throw new Error("Ошибка обновления");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!form) return <div className="text-center mt-5">Загрузка...</div>;

  return (
    <div className="container mt-4">
      <h3>Редактировать объявление</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {["title", "description", "city", "address", "price", "rooms"].map((field) => (
          <div key={field} className="mb-3">
            <label>{field}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}
        <button className="btn btn-primary">Сохранить</button>
      </form>
    </div>
  );
}

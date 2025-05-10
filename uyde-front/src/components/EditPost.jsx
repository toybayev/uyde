import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Token ${token}` };

    fetch(`http://localhost:8000/api/posts/${id}/`, { headers })
      .then(res => res.json())
      .then(setForm)
      .catch(() => setError("Ошибка загрузки поста"));

    fetch(`http://localhost:8000/api/posts/${id}/photos/`, { headers })
      .then(res => res.json())
      .then(setPhotos)
      .catch(() => setError("Ошибка загрузки фото"));
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewPhotoChange = (e) => {
    setNewPhotos([...e.target.files]);
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Удалить это фото?")) return;
    const res = await fetch(`http://localhost:8000/api/posts/${id}/photos/${photoId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Ошибка обновления поста");



      for (let file of newPhotos) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("post", id);

        const upload = await fetch(`http://localhost:8000/api/posts/${id}/photos/`, {
          method: "POST",
          headers: { Authorization: `Token ${token}` },
          body: formData,
        });

        if (!upload.ok) throw new Error("Ошибка загрузки нового фото");
      }

      alert("✅ Пост и фото обновлены");
      navigate(`/posts/${id}`);
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

        <div className="mb-3">
          <label>Тип объявления</label>
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
          <label>📷 Текущие фото</label>
          <div className="d-flex gap-3 flex-wrap">
            {photos.map((photo) => (
              <div key={photo.id} className="position-relative" style={{ width: "100px", height: "100px" }}>
                <img
                  src={photo.image}
                  alt="Фото"
                  className="img-thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="btn btn-sm btn-danger position-absolute"
                  style={{
                    top: "-8px",
                    right: "-8px",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "0.7rem",
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label>📥 Добавить новые фото</label>
          <input type="file" multiple className="form-control" onChange={handleNewPhotoChange} />
        </div>

        <button className="btn btn-primary">Сохранить</button>
      </form>
    </div>
  );
}

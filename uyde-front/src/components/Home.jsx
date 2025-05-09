import React from 'react';
import { FaHome, FaKey, FaBuilding, FaHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="container text-center mt-5">
            <h1 className="mb-4">🏠 Uyde — Ваша недвижимость онлайн</h1>
            <p className="lead text-muted mb-5">
                Добро пожаловать! Здесь вы можете покупать, арендовать, продавать или сдавать жильё по всей стране.
            </p>

            <div className="row justify-content-center g-4">
                <div className="col-md-3">
                    <div className="card h-100 shadow-sm p-3">
                        <FaHome size={40} className="mb-3 text-primary" />
                        <h5>Покупка недвижимости</h5>
                        <p className="text-muted">Находите лучшие предложения по всей стране.</p>
                        <Link to="/posts" className="btn btn-outline-primary btn-sm">Перейти</Link>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card h-100 shadow-sm p-3">
                        <FaKey size={40} className="mb-3 text-success" />
                        <h5>Аренда жилья</h5>
                        <p className="text-muted">Снимайте квартиры, дома и коммерческую недвижимость.</p>
                        <Link to="/posts" className="btn btn-outline-success btn-sm">Посмотреть</Link>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card h-100 shadow-sm p-3">
                        <FaBuilding size={40} className="mb-3 text-warning" />
                        <h5>Продажа недвижимости</h5>
                        <p className="text-muted">Разместите своё объявление и найдите покупателя.</p>
                        <Link to="/create-post" className="btn btn-outline-warning btn-sm">Создать</Link>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card h-100 shadow-sm p-3">
                        <FaHandshake size={40} className="mb-3 text-danger" />
                        <h5>Сдача в аренду</h5>
                        <p className="text-muted">Сдавайте жильё надёжным арендаторам быстро и просто.</p>
                        <Link to="/create-post" className="btn btn-outline-danger btn-sm">Разместить</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

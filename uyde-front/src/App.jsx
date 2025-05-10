import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignUp from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import PostsList from './components/PostsList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import FavoritesList from './components/FavoritesList';
import Home from './components/Home';
import EditPost from './components/EditPost';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';




const PrivateRoute = ({ token, children }) => {
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("user");
            return saved && saved !== "undefined" ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("❌ Failed to parse user from localStorage", e);
            return null;
        }
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        }
    }, [token]);

    const handleLogin = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <div className="App">
            <Router>
                <Navbar token={token} user={user} onLogout={handleLogout} />

                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />

                    <Route path="/users" element={<UserList token={token} />} />
                    <Route path="/users/:id" element={<UserDetail token={token} />} />


                    <Route path="/posts" element={<PostsList token={token} />} />
                    <Route path="/posts/:id" element={<PostDetail token={token} user={user} />} />
                    <Route path="/posts/:id/edit" element={<EditPost token={token} />} />
                    <Route path="/create-post" element={<CreatePost token={token} />} />
                    <Route path="/posts/:id" element={<PostDetail token={token} user={user} />} />

                    <Route
                        path="/favorites"
                        element={
                            <PrivateRoute token={token}>
                                <FavoritesList userPk={user?.id} token={token} />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute token={token}>
                                <Profile token={token} user={user} />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

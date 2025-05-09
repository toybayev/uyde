import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar';
import UserList from "./components/UserList";
import UserDetail from './components/UserDetail';
import PostsList from './components/PostsList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import Home from './components/Home'; // ✅ Импорт Home
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const handleLogout = () => {
        setToken(null);
    };

    return (
        <div className="App">
            <Router>
                <Navbar token={token} onLogout={handleLogout} />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/signup" element={<SignUp onLogin={setToken} />} />
                    <Route path="/login" element={<Login onLogin={setToken} />} />
                    <Route path="/users" element={<UserList token={token} />} />
                    <Route path="/users/:id" element={<UserDetail token={token} />} />
                    <Route path="/posts" element={<PostsList token={token} />} />
                    <Route path="/posts/:id" element={<PostDetail token={token} />} />
                    <Route path="/create-post" element={<CreatePost token={token} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

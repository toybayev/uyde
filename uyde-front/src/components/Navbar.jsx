import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ token, onLogout, user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
            <div className="container-fluid">
                <Link to="/home" className="navbar-brand fw-bold fs-4">🏠 Uyde.kz</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {token && (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/rent-posts">🏠 Rent</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/sale-posts">🏢 Sale</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/posts">All Posts</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/create-post">➕ Create Post</Link></li>
                            </>
                        )}

                        {!token ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/login">🔒 Login</Link></li>
                            </>
                        ) : (
                            <>
                                {/*<li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>*/}
                                {user && (
                                    <>
                                        <li className="nav-item"><Link className="nav-link" to="/profile">👤 Profile</Link></li>
                                        <li className="nav-item"><Link className="nav-link" to="/favorites">❤️ Favorites</Link></li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>

                    {token && (
                        <button
                            onClick={handleLogout}
                            className="btn btn-danger btn-sm"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ token, onLogout, user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate('/login');
    };

    return (
        <nav style={{
            padding: '10px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div>
                <Link to="/home" style={{ marginRight: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                    🏠 Uyde.kz
                </Link>

                {token && (
                    <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
                )}

                {!token ? (
                    <>
                        <Link to="/signup" style={{ marginRight: '10px' }}>Sign Up</Link>
                        <Link to="/login" style={{ marginRight: '10px' }}>🔒 Login</Link>
                    </>
                ) : (
                    <>
                        <Link to="/users" style={{ marginRight: '10px' }}>Users</Link>

                        {user && (
                            <>
                                <Link to={`/users/${user.id}`} style={{ marginRight: '10px' }}>
                                    Profile
                                </Link>
                                <Link to="/favorites" style={{ marginRight: '10px' }}>
                                    ❤️ Favorites
                                </Link>
                            </>
                        )}

                        <Link to="/posts" style={{ marginRight: '10px' }}>All Posts</Link>
                        <Link to="/create-post" style={{ marginRight: '10px' }}>Create Post</Link>

                        <button onClick={handleLogout} style={{
                            marginLeft: '15px',
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

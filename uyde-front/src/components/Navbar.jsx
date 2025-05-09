import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ token, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };

    return (
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
            {token && (
                <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
            )}

            {!token ? (
                <>
                    <Link to="/signup" style={{ marginRight: '10px' }}>Sign Up</Link>
                    <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                </>
            ) : (
                <>
                    <Link to="/users" style={{ marginRight: '10px' }}>Users</Link>
                    <Link to="/users/1" style={{ marginRight: '10px' }}>User #1</Link>
                    <Link to="/posts" style={{ marginRight: '10px' }}>All Posts</Link>
                    <Link to="/create-post" style={{ marginRight: '10px' }}>Create Post</Link>
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
                </>
            )}
        </nav>
    );
}

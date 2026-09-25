import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Mina Rätter</Link>
      
      {user ? (
        <button onClick={handleLogout}>Logga ut</button>
      ) : (
        <>
          <Link to="/login">Logga in</Link>
          <Link to="/register">Skapa konto</Link>
        </>
      )}
    </nav>
  );
}
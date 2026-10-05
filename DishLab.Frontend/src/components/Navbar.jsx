import { useAuth } from '../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={logoStyle}>
          🧪 DishLab
        </div>

        <div style={userSectionStyle}>
          {user?.email && (
            <span style={emailStyle}>
              Inloggad som: <strong>{user.email}</strong>
            </span>
          )}
          <button onClick={logout} style={logoutBtnStyle}>
            Logga ut
          </button>
        </div>
      </div>
    </header>
  );
}

// Enkel och ren styling
const headerStyle = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  padding: '12px 0',
  marginBottom: '20px',
};

const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '0 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#111827',
};

const userSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const emailStyle = {
  fontSize: '0.9rem',
  color: '#4b5563',
};

const logoutBtnStyle = {
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #d1d5db',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};
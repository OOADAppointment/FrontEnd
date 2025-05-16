import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    } else {
      alert('Please enter both username and password.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f3e5f5, #e1f5fe)',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width: '300px',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', color: '#6a1b9a', fontWeight: 'bold' }}>
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.8rem',
              background: '#ba68c8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

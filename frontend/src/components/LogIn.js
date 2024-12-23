import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

  
    try {
      const response = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        console.error('Login error:', data);
        return;
      }

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        const userData = { email };
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);

        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="white-container">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
          <label>Email:</label>
          <input
            type="email"
            value={email}
            style={{marginBottom: "1rem"}}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            style={{marginBottom: "1rem"}}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;

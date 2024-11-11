import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validCredentials, setValidCredentials] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   
    fetch(process.env.PUBLIC_URL + '/login.json')
      .then((response) => response.json())
      .then((data) => setValidCredentials(data))
      .catch((error) => console.error('Error loading credentials:', error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Kiểm tra thông tin đăng nhập từ file JSON
    if (validCredentials && username === validCredentials.username && password === validCredentials.password) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/admin_page/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form> 
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', { username, password });
      alert('User registered successfully');
    } catch (error) {
      alert('Error registering user');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setToken(response.data.token);
      alert('Login successful');
    } catch (error) {
      alert('Invalid username or password');
    }
  };

  const handleProtected = async () => {
    try {
      const response = await axios.get('http://localhost:5000/protected', {
        headers: {
          Authorization: token,
        },
      });
      alert(response.data.message);
    } catch (error) {
      alert('Unauthorized');
    }
  };

  return (
    <div>
      <h1>MERN JWT Auth</h1>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleProtected}>Protected Route</button>
    </div>
  );
}

export default App;

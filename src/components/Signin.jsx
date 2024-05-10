import React, { useState } from 'react';
import { auth } from './firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import "./signin.css"
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      // If login is successful, you can redirect the user to another page
      console.log("User logged in:", userCredential.user.uid);
      alert('hey')
      window.location.href = "/dashboard";
    } catch (error) {
      // Handle login errors
      console.error("Login error:", error.message);
      setErrorMessage("Login failed! Please check your username and password.");
    }
  };

  return (
    <div className="container body">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div className="signup-link">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

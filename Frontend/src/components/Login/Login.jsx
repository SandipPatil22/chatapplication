

import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useDispatch } from "react-redux";
import { saveUserData } from "../../store/userslice";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate(); // Initialize navigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8011/api/user/login",
        { username, password }
      );
      console.log(response, "login user data");

      // extract token from response
      const { token, _id } = response.data;

      if (token) {
        
        setError("");
        const userData = { token, _id };
        localStorage.setItem("auth", JSON.stringify(userData));
    
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }
        dispatch(saveUserData({ token, id: _id }));
        navigate("/home"); // Navigate to the homepage
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      setError("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username/Email"
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
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <div className="signup-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;

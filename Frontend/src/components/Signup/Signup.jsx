import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css"; // Create a new CSS file similar to Login.css
import { useNavigate,Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post(
        "http://localhost:8011/api/user/createUser",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Signup success:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response || error.message);
      setError("Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSignUp} className="signup-form">
        <input
          type="text"
          placeholder="fullName"
          value={fullName}
          onChange={(e) => setfullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="profile-pic-input">
          <label htmlFor="profilePic">Upload Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default SignUp;

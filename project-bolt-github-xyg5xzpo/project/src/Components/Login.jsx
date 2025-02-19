import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock authentication for demonstration
    if (login === "demo" && password === "demo") {
      // Simulate a token
      const mockToken = "mock-jwt-token";
      localStorage.setItem("token", mockToken);
      alert("Login successful");
      navigate("/");
    } else {
      alert("Invalid credentials. Try using demo/demo");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => setLogin(e.target.value)}
              type="text"
              id="username"
              name="username"
              value={login}
              placeholder="Enter your username (demo)"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password (demo)"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="extra-options">
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
          <p className="not-a-member">
            Not a member?{" "}
            <a href="#" className="sign-up-link">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
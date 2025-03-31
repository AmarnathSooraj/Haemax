import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Image from "../assets/aboutImg.png";
import google from "../assets/google-logo.png";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      // Store the token and profile picture
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("profilePic", response.data.profilePic);
      
      // Dispatch an event to update the navbar
      window.dispatchEvent(new Event("storage"));

      // Navigate to the home page after successful login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img className="login-img" src={Image} alt="Login Illustration" />

      <div className="login-form">
        <div className="one">
          <p>
            <span className="create">Create your account</span> to continue to blood donation
          </p>
          <button className="login-google">
            <img src={google} alt="Google Logo" />
            Continue with Google
          </button>
        </div>

        <div><hr /></div>

        <form onSubmit={handleLogin}>
          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>
            Don't have an account? <Link className="in" to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

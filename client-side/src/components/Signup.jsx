import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import google from "../assets/google-logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (formData.phone.length < 10) {
      return setError("Phone number must be at least 10 digits");
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        fname: formData.fname,
        lname: formData.lname,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="sig1">
        <p>
          <span>Create your account</span> to continue to blood donation
        </p>
        <button>
          <img src={google} alt="Google logo" /> Sign up with Google
        </button>
      </div>

      <div className="sig2">
        <form className="signup" onSubmit={handleSubmit}>
          <label htmlFor="fname">First Name</label>
          <input type="text" id="fname" name="fname" value={formData.fname} onChange={handleChange} required />

          <label htmlFor="lname">Last Name</label>
          <input type="text" id="lname" name="lname" value={formData.lname} onChange={handleChange} required />

          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />

          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign-up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

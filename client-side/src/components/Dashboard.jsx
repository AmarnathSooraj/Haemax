import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHandHoldingHeart, FaClipboardList } from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your blood donation activities efficiently.</p>
      </header>

      <div className="dashboard-cards">
        <Link to="/profile" className="dashboard-card">
          <FaUser className="icon" />
          <h3>View Profile</h3>
          <p>Check and update your personal details.</p>
        </Link>

        <Link to="/donations" className="dashboard-card">
          <FaHandHoldingHeart className="icon" />
          <h3>My Donations</h3>
          <p>Track your past and upcoming donations.</p>
        </Link>

        <Link to="/requests" className="dashboard-card">
          <FaClipboardList className="icon" />
          <h3>Donation Requests</h3>
          <p>See who needs your help and donate blood.</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

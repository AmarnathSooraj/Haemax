import React, { useState } from "react";
import "./Donation.css";
import { FaTint, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

function Donation() {
  const [donations, setDonations] = useState([
    { date: "2024-03-15", recipient: "City Hospital", location: "New York" },
    { date: "2023-12-10", recipient: "Red Cross Center", location: "Los Angeles" },
  ]);

  const [newDonation, setNewDonation] = useState({ date: "", location: "" });

  const handleChange = (e) => {
    setNewDonation({ ...newDonation, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDonations([...donations, { ...newDonation, recipient: "Pending" }]);
    setNewDonation({ date: "", location: "" });
  };

  return (
    <div className="donation-container">
      <div className="donation-left">
        <h2>Donation History</h2>
        <ul>
          {donations.map((donation, index) => (
            <li key={index}>
              <FaTint /> <strong>{donation.date}</strong> - {donation.recipient} ({donation.location})
            </li>
          ))}
        </ul>
      </div>

      <div className="donation-right">
        <h2>Schedule a Donation</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <FaCalendarAlt /> Preferred Date:
            <input type="date" name="date" value={newDonation.date} onChange={handleChange} required />
          </label>
          <label>
            <FaMapMarkerAlt /> Location:
            <input type="text" name="location" value={newDonation.location} onChange={handleChange} required />
          </label>
          <button type="submit">Schedule</button>
        </form>
        
        <h3>Donation Guidelines</h3>
        <p>Ensure you are healthy and have waited at least 3 months since your last donation.</p>
      </div>
    </div>
  );
}

export default Donation;

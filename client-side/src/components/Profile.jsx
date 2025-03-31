import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaUserEdit, FaEnvelope, FaPhone, FaTint, FaCalendarAlt, FaCheck, FaTimes, FaCamera } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    bloodGroup: "O+",
    available: true,
    profileImage: null,
    lastDonated: "2024-02-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch user profile data from backend API
    // axios.get('/api/profile').then(response => setUser(response.data));
  }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setUpdatedUser(user);
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser(updatedUser);
    if (selectedImage) {
      setUser((prev) => ({ ...prev, profileImage: selectedImage }));
    }
    setIsEditing(false);
    // axios.post('/api/profile', updatedUser);
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleAvailabilityToggle = () => {
    setUpdatedUser((prev) => ({ ...prev, available: !prev.available }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      {/* Left Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-card">
          <div className="profile-photo-section">
            <label htmlFor="profileImage" className="profile-photo">
              <img
                src={selectedImage || user.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              {isEditing && <FaCamera className="camera-icon" />}
            </label>
            {isEditing && <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} />}
          </div>

          <h2>{user.firstName} {user.lastName}</h2>
          <p className="blood-group">Blood Group: <strong>{user.bloodGroup}</strong></p>

          <div className="availability-section">
            <span className={`availability ${updatedUser.available ? "available" : "not-available"}`}>
              {updatedUser.available ? "Available for Donation" : "Not Available"}
            </span>
            <label className="switch">
              <input type="checkbox" checked={updatedUser.available} onChange={handleAvailabilityToggle} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="donation-status">
            <FaCalendarAlt className="calendar-icon" />
            <p>Last Donated: <strong>{user.lastDonated}</strong></p>
          </div>
        </div>
      </div>

      {/* Main Profile Section */}
      <div className="profile-main">
        <h1>My Profile</h1>
        <div className="profile-info">
          <div className="profile-field">
            <label><FaUserEdit /> Name</label>
            {isEditing ? (
              <input type="text" name="firstName" value={updatedUser.firstName} onChange={handleChange} />
            ) : (
              <p>{user.firstName} {user.lastName}</p>
            )}
          </div>

          <div className="profile-field">
            <label><FaEnvelope /> Email</label>
            {isEditing ? (
              <input type="email" name="email" value={updatedUser.email} onChange={handleChange} />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="profile-field">
            <label><FaPhone /> Phone</label>
            {isEditing ? (
              <input type="text" name="phone" value={updatedUser.phone} onChange={handleChange} />
            ) : (
              <p>{user.phone}</p>
            )}
          </div>
        </div>

        <div className="profile-buttons">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}><FaCheck /> Save</button>
              <button className="cancel-btn" onClick={handleCancel}><FaTimes /> Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={handleEdit}><FaUserEdit /> Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

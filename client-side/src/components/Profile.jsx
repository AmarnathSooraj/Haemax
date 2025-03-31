import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "./Profile.css";
import { FaUserEdit, FaEnvelope, FaPhone, FaTint, FaCalendarAlt, FaCheck, FaTimes, FaCamera } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure user is authenticated
        console.log("Token:", token);  // Log token for debugging
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data) {
          setUser(response.data);
          setUpdatedUser(response.data); // Set initial values for editing
        }
      } catch (error) {
        console.error("Error fetching profile:", error);  // Log the error
      }
    };
  
    fetchUserProfile();
  }, []);
  

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setUpdatedUser(user);
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/profile", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (selectedImage) {
        setUpdatedUser((prev) => ({ ...prev, profileImage: selectedImage }));
      }

      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-card">
          <div className="profile-photo-section">
            <label htmlFor="profileImage" className="profile-photo">
              <img src={selectedImage || user.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
              {isEditing && <FaCamera className="camera-icon" />}
            </label>
            {isEditing && <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} />}
          </div>

          <h2>{user.firstName} {user.lastName}</h2>
          <p className="blood-group">Blood Group: <strong>{user.bloodGroup}</strong></p>

          <div className="donation-status">
            <FaCalendarAlt className="calendar-icon" />
            <p>Last Donated: <strong>{user.lastDonated}</strong></p>
          </div>
        </div>
      </div>

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

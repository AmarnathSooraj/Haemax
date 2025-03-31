import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    blood_type: '',
    gender: '',
    weight: '',
    dob: '',
    city: '',
    district: '',
    lastDonatedDate: ''
  });

  const [healthConditions, setHealthConditions] = useState({
    smoking: false,
    alcoholic: false,
    pregnant: false,
    breastfeeding: false,
    hivAids: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setHealthConditions((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const checkLastDonatedDate = (lastDonatedDate) => {
    if (!lastDonatedDate) return true; // ✅ If empty, allow donation.
  
    const lastDonation = new Date(lastDonatedDate);
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3); // 3 months before today
  
    return lastDonation <= threeMonthsAgo; // ✅ Only allow if donation was 3+ months ago.
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate age
    const age = calculateAge(formData.dob);
    if (age < 18) {
      alert("You are not eligible to donate blood (Must be 18 or older).");
      return;
    }

    // Validate last donated date only if it's provided
    if (formData.lastDonatedDate && !checkLastDonatedDate(formData.lastDonatedDate)) {
      alert("You are not eligible to donate. Last donation must be at least 3 months ago.");
      return;
    }


    // Eligibility check for health conditions
    if (Object.values(healthConditions).includes(true)) {
      alert("You are not eligible to donate blood due to health conditions.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert("Form submitted successfully!");
      navigate('/'); // ✅ Redirect to home page

      setFormData({
        name: '',
        phone: '',
        email: '',
        blood_type: '',
        gender: '',
        weight: '',
        dob: '',
        city: '',
        district: '',
        lastDonatedDate: ''
      });

      setHealthConditions({
        smoking: false,
        alcoholic: false,
        pregnant: false,
        breastfeeding: false,
        hivAids: false,
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="article">
      <p>Form</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Your Name:</label>
        <input type="text" id="name" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="phone">Phone No.:</label>
        <input type="tel" id="phone" name="phone" placeholder="Phone No." value={formData.phone} onChange={handleChange} required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="email@gmail.com" value={formData.email} onChange={handleChange} required />

        <label htmlFor="blood_type">Blood Group:</label>
        <select id="blood_type" name="blood_type" value={formData.blood_type} onChange={handleChange} required>
          <option value="" disabled>Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <label htmlFor="gender">Gender:</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="weight">Weight (kg):</label>
        <input type="number" id="weight" name="weight" placeholder="Weight(kg)" min="10" value={formData.weight} onChange={handleChange} required />

        <label htmlFor="dob">Date of Birth:</label>
        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />

        <label htmlFor="district">District:</label>
        <input type="text" id="district" name="district" placeholder="District" value={formData.district} onChange={handleChange} required />

        <label htmlFor="city">City:</label>
        <input type="text" id="city" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />

        <label htmlFor="lastDonatedDate">Last Donated:</label>
        <input type="date" id="lastDonatedDate" name="lastDonatedDate" value={formData.lastDonatedDate} onChange={handleChange} />

        <div className="topping">
          <label><input type="checkbox" name="smoking" checked={healthConditions.smoking} onChange={handleChange} /> Smoking</label>
          <label><input type="checkbox" name="alcoholic" checked={healthConditions.alcoholic} onChange={handleChange} /> Alcoholic</label>
          <label><input type="checkbox" name="pregnant" checked={healthConditions.pregnant} onChange={handleChange} /> Pregnant</label>
          <label><input type="checkbox" name="breastfeeding" checked={healthConditions.breastfeeding} onChange={handleChange} /> Breastfeeding</label>
          <label><input type="checkbox" name="hivAids" checked={healthConditions.hivAids} onChange={handleChange} /> HIV/Aids</label>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;

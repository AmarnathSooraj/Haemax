import React, { useState, useEffect, useRef } from 'react';
import './ReceiverSearch.css';

function ReceiverSearch() {
  // State for receiver details
  const [receiver, setReceiver] = useState({
    name: '',
    phone: ''
  });

  // State for donor search parameters
  const [searchParams, setSearchParams] = useState({
    blood_type: '',
    district: '',
    city: ''
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Ref to store debounce timeout id
  const debounceTimeout = useRef(null);

  // Handle changes for receiver details
  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for search parameters
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to calculate donor's age (if dob is provided)
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Function to store receiver details in the receiver table
  const storeReceiver = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/receivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: receiver.name.trim(),
          phone: receiver.phone.trim(),
          blood_type: searchParams.blood_type.trim(),
          district: searchParams.district.trim(),
          city: searchParams.city.trim()
        })
      });
      if (!response.ok) {
        throw new Error('Failed to store receiver data');
      }
      console.log('Receiver data stored successfully.');
    } catch (err) {
      console.error('Receiver storage error:', err);
      // You might choose to set an error here, or proceed regardless
    }
  };

  const handleSearch = async () => {
    // Validate that receiver details are filled
    if (receiver.name.trim() === '' || receiver.phone.trim() === '') {
      setError("Please enter your name and phone number before searching.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    // First, store receiver details to the receiver table
    await storeReceiver();
    
    // Build URL with encoded and trimmed query parameters
    const url = `http://localhost:5000/api/donors/search?blood_type=${encodeURIComponent(searchParams.blood_type.trim())}&district=${encodeURIComponent(searchParams.district.trim())}&city=${encodeURIComponent(searchParams.city.trim())}`;
    console.log("Fetching URL:", url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          setDonors([]);
          setError("No donors found");
        } else {
          throw new Error('Failed to fetch donors');
        }
      } else {
        const data = await response.json();
        console.log("Fetched Data:", data);
        setDonors(data);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
    }
    
    setLoading(false);
  };

  // Debounce effect for donor search when search parameters change (if all fields are non-empty)
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (
      searchParams.blood_type.trim() !== '' &&
      searchParams.district.trim() !== '' &&
      searchParams.city.trim() !== ''
    ) {
      debounceTimeout.current = setTimeout(() => {
        console.log("Debounced search triggered with:", searchParams);
        handleSearch();
      }, 500);
    } else {
      // Clear donors if any search field is empty
      setDonors([]);
    }
    
    return () => clearTimeout(debounceTimeout.current);
  }, [searchParams]);
  
  return (
    <div className="search-container">
      <h2>Find Blood Donors</h2>
      
      {/* Receiver Details Section */}
      <div className="receiver-details">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={receiver.name}
          onChange={handleReceiverChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone Number"
          value={receiver.phone}
          onChange={handleReceiverChange}
          required
        />
      </div>
      
      {/* Donor Search Fields */}
      <select name="blood_type" value={searchParams.blood_type} onChange={handleSearchChange} required>
        <option value="" disabled>Select Blood Group</option>
        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <input type="text" name="district" placeholder="District" value={searchParams.district} onChange={handleSearchChange} required />
      <input type="text" name="city" placeholder="City" value={searchParams.city} onChange={handleSearchChange} required />
      
      <button onClick={handleSearch} disabled={loading}>Search</button>
      
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      <ul className="donor-list">
        {donors.length > 0 ? (
          donors.map((donor) => (
            <li key={donor.id} className="donor-card">
              <img
                className="donor-profile"
                src={donor.profile_pic || '/default-profile.png'}
                alt={donor.name}
              />
              <div className="donor-info">
                <h3>{donor.name}</h3>
                <p>Age: {calculateAge(donor.dob)}</p>
                <p>{donor.phone}</p>
              </div>
            </li>
          ))
        ) : (
          !loading && <p>No donors found</p>
        )}
      </ul>
    </div>
  );
}

export default ReceiverSearch;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RentalPage.css";

function RentalPage() {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      console.log("Fetching rentals..."); // Debug
      const res = await axios.get("http://localhost:5001/rentals");
      console.log("Response received:", res.data); // Debug
      setRents(res.data);
    } catch (err) {
      console.error("Error details:", err); // Debug
      console.error("Error response:", err.response?.data); // Debug
      console.error("Error message:", err.message); // Debug
      alert("Failed to load rentals: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };


  // ===== Delete one rental =====
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rental?")) return;

    try {
      await axios.delete(`http://localhost:5001/rentals/${id}`);
      setRents(rents.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete rental");
    }
  };

  // ===== Clear all rentals =====
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all rentals?")) return;

    try {
      await axios.delete("http://localhost:5001/rentals");
      setRents([]);
    } catch (err) {
      console.error(err);
      alert("Failed to clear rentals");
    }
  };

  if (loading) {
    return (
      <div className="saved-rentals-page">
        <p>Loading rentals...</p>
      </div>
    );
  }

  return (
    <div className="saved-rentals-page">
      <div className="saved-rentals-container">
        <div className="page-header">
          <h2>Saved Rentals</h2>
          {rents.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>

        {rents.length === 0 ? (
          <p>No rentals found</p>
        ) : (
          <table className="rentals-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Car</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Driver</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rents.map(r => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>{r.name}</td>
                  <td>{r.car_name}</td>
                  <td>{new Date(r.start_date).toLocaleDateString()}</td>
                  <td>{new Date(r.end_date).toLocaleDateString()}</td>
                  <td>{r.days}</td>
                  <td>{r.driver ? "Yes" : "No"}</td>
                  <td>${Number(r.total).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RentalPage;
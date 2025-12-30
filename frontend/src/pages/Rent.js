import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Rent.css";

function Rent() {
  const DRIVER_FEE = 25;
  const location = useLocation();
  const navigate = useNavigate();

  // GET carId, carName, and price from CarCard
  const selectedCarId = location.state?.carId || null;
  const selectedCarName = location.state?.carName || "";
  const selectedPrice = location.state?.price || 0;

  const [rentData, setRentData] = useState({
    name: "",
    car: selectedCarName,
    carPrice: selectedPrice,
    startDate: "",
    endDate: "",
    driver: false
  });

  const calculateDays = () => {
    if (!rentData.startDate || !rentData.endDate) return 0;
    const start = new Date(rentData.startDate);
    const end = new Date(rentData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    if (days === 0) return 0;
    
    let carTotal = rentData.carPrice * days;
    const hasDiscount = days > 7;
    if (hasDiscount) carTotal *= 0.9;
    
    const driverTotal = rentData.driver ? DRIVER_FEE * days : 0;
    return carTotal + driverTotal;
  };

  const calculateCarSubtotal = () => {
    const days = calculateDays();
    return rentData.carPrice * days;
  };

  const calculateDiscount = () => {
    const days = calculateDays();
    if (days > 7) {
      return rentData.carPrice * days * 0.1;
    }
    return 0;
  };

  const calculateDriverFee = () => {
    const days = calculateDays();
    return rentData.driver ? DRIVER_FEE * days : 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRentData({
      ...rentData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rentData.name || !rentData.startDate || !rentData.endDate) {
      return alert("Please fill all fields");
    }

    const days = calculateDays();
    if (days <= 0) return alert("End date must be after start date");

    // Send ONLY car_id - backend will get name and price from cars table
    const data = {
      name: rentData.name,
      car_id: selectedCarId,
      start_date: rentData.startDate,
      end_date: rentData.endDate, 
      days: days,
      driver: rentData.driver,
      total: calculateTotal()
    };

    console.log("Submitting rental data:", data);

    try {
      await axios.post("http://localhost:5001/rentals", data);
      alert("Rental saved successfully!");
      
      setRentData({
        name: "",
        car: selectedCarName,
        carPrice: selectedPrice,
        startDate: "",
        endDate: "",
        driver: false
      });
      
    } catch (error) {
      console.error("Error saving rental:", error);
      alert(error.response?.data?.error || "Failed to save rental");
    }
  };

  const days = calculateDays();
  const total = calculateTotal();
  const carSubtotal = calculateCarSubtotal();
  const discount = calculateDiscount();
  const driverFee = calculateDriverFee();
  const hasDiscount = days > 7;

  return (
    <div className="rent-page">
      <div className="rent-container">
        <div className="rent-header">
          <h2>Rent a Car</h2>
          <button 
            className="view-rentals-btn"
            onClick={() => navigate("/rentals")}
          >
            View Saved Rentals
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rental-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={rentData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Selected Car</label>
            <input 
              type="text" 
              value={rentData.car} 
              readOnly 
              className="readonly-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={rentData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={rentData.endDate}
                onChange={handleChange}
                min={rentData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="driver"
                checked={rentData.driver}
                onChange={handleChange}
              />
              <span>Include Driver (+${DRIVER_FEE}/day)</span>
            </label>
          </div>

          {days > 0 && (
            <div className="price-summary">
              <h3>Price Breakdown</h3>
              
              <div className="price-row">
                <span>Car Rental ({days} days × ${rentData.carPrice}/day):</span>
                <span>${carSubtotal.toFixed(2)}</span>
              </div>
              
              {hasDiscount && (
                <div className="price-row discount">
                  <span>Discount (10% for {days} days):</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              {rentData.driver && (
                <div className="price-row">
                  <span>Driver Fee ({days} days × ${DRIVER_FEE}/day):</span>
                  <span>${driverFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="price-row total">
                <span>Total Price:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={days <= 0}>
              {days <= 0 ? "Select Dates First" : "Confirm Rental"}
            </button>
          </div>
        </form>

        {days > 0 && (
          <div className="rental-info">
            <p>
              <strong>Rental Period:</strong> {days} day{days !== 1 ? 's' : ''}
              {hasDiscount && <span className="discount-badge"> (10% Discount Applied!)</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rent;
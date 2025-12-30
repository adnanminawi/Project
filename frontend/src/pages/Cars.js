import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import CarCard from "../components/CarCard";
import Upper from "../components/Upper";
import Footer from "../components/Footer";

import '../styles/Cars.css';

function Cars() {
  const [cars, setCars] = useState([]);
  const [driverSelected, setDriverSelected] = useState([]);
  const driverFee = 25;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        const res = await axios.get(`${API_URL}/cars`);
        setCars(res.data);
        setDriverSelected(res.data.map(() => false));
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCars();
  }, []);

  const toggleDriver = (index) => {
    const updated = [...driverSelected];
    updated[index] = !updated[index];
    setDriverSelected(updated);
  };

  const handleUpdate = (carId) => {
    navigate(`/updatecar/${carId}`);
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`${API_URL}/cars/${carId}`);
        alert("Car deleted successfully!");
        // Refresh the cars list
        const res = await axios.get(`${API_URL}/cars`);
        setCars(res.data);
        setDriverSelected(res.data.map(() => false));
      } catch (err) {
        console.error(err);
        alert("Failed to delete car");
      }
    }
  };

  return (
    <div>
      <Upper />
      <h2>Available Cars</h2>
       <button 
          className="add-car-btn" 
          onClick={() => navigate("/AddCar")}
        >
          + Add New Car
        </button>
      <div className="cars-grid">
        {cars.map((car, index) => (
          <div key={car.id} className="car-container">
            <CarCard
              car={car}
              index={index}
              driverSelected={driverSelected[index]}
              toggleDriver={toggleDriver}
              driverFee={driverFee}
            />
            <div className="car-actions">
              <button 
                className="update-btn" 
                onClick={() => handleUpdate(car.id)}
              >
                Update
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(car.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Cars;
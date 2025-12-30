import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../config";
import '../styles/UpdateCar.css';

const UpdateCar = () => {
  const [name, setName] = useState('');
  const [descrp, setDescrp] = useState('');
  const [priceday, setPriceday] = useState(''); 
  const [discount, setDiscount] = useState('');
  const [img, setImg] = useState(''); 

  const navigate = useNavigate();
  const {id} = useParams();
  const [error, setError] = useState(false);
 
  // Fetching one record from cars table 
  useEffect(() => {
    axios.get(`${API_URL}/cars/${id}`)  
      .then(res => {
        setName(res.data.name);          
        setDescrp(res.data.descrp);      
        setPriceday(res.data.priceday);  
        setDiscount(res.data.discount);  
        setImg(res.data.img);            
      })
      .catch(err => {
        console.log(err);
        alert("Failed to load car data");
      });
  }, [id]);

  const handleClick = async (e) => {
    e.preventDefault();
     
    try {
      await axios.put(`${API_URL}/cars/${id}`, {  
        name, 
        descrp, 
        priceday,   
        discount,
        img
      });
      alert("Car updated successfully!");
      navigate("/cars");
    } catch (err) {
      console.log(err);
      alert("Failed to update car");
      setError(true);
    }
  };

  return (
    <div className='app'> 
      <div className="form">
        <h1>Update the Car</h1>
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label>Description</label>
        <input
          type="text"
          placeholder="Description"
          name="descrp"
          value={descrp}
          onChange={e => setDescrp(e.target.value)}
        />
        <label>Price per Day</label>
        <input
          type="number"
          placeholder="Price per Day"
          name="priceday"
          value={priceday}
          onChange={e => setPriceday(e.target.value)}
        />
        <label>Discount %</label>
        <input
          type="number"
          placeholder="Discount %"
          name="discount"
          value={discount}
          onChange={e => setDiscount(e.target.value)}
        />
        <label>Image</label>
        <input
          type="text"
          placeholder="Image filename (e.g., car.jpg)"
          name="img"
          value={img}
          onChange={e => setImg(e.target.value)}
        />
        <button onClick={handleClick}>Update</button>
        {error && <p style={{color: 'red'}}>Something went wrong!</p>}
        <Link to="/cars">Back to Cars</Link>
      </div>
    </div>
  );
};

export default UpdateCar;
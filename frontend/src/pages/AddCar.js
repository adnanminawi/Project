import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddCar = () => {
  const [car, setCar] = useState({
    name: "",
    descrp: "", 
    priceday: "",
    discount: "",
    img: ""
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();

  const handleFile = (e) => { 
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
   
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (e) => {
    setCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 
  const handleClick = async (e) => {
    e.preventDefault();

    if (!car.name || !car.descrp || !car.priceday || !car.discount || !file) {
      alert("Please fill all fields and select an image");
      return;
    }
    const formdata = new FormData();
    
    formdata.append('name', car.name);
    formdata.append('descrp', car.descrp);
    formdata.append('priceday', car.priceday);
    formdata.append('discount', car.discount);
    formdata.append('image', file);

    try {

      await axios.post("http://localhost:5001/cars", formdata);
      navigate("/cars");
    } catch (err) {
      console.log(err);
      setError(true)
    }
  };

  return (
    <div className='app'> 
      <div className="form">
        <h1>Add New Car</h1>

        <input
          type="text"
          placeholder="Car name"
          name="name"
          value={car.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Description"
          name="descrp"
          value={car.descrp}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Price per day"
          name="priceday"
          value={car.priceday}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Discount %"
          name="discount"
          value={car.discount}
          onChange={handleChange}
          required
        />
        <div className="image-upload">
          <label>Upload Car Image:</label>
          {previewUrl && (
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{width: '200px', height: '150px', objectFit: 'cover', margin: '10px 0'}}
            />
          )}
          <input
            type="file"
            accept="image/*"
            name="img"
            onChange={handleFile}
            required
          />
        </div>

        <button onClick={handleClick}>Add Car</button>
        {error && <p style={{color: 'red'}}>Something went wrong!</p>}
        <Link to="/cars">Back to Cars</Link>
      </div>
    </div>
  );
};

export default AddCar;
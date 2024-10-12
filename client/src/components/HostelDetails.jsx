import React, { useState } from 'react';
import "./HostelDetails.css";

const images = [
  { src: "/src/assets/Hostelimage.jpg", alt: "First slide" },
  { src: "/src/assets/Hostelimage2.jpg", alt: "Second slide" },
  { src: "/src/assets/Hostelimage3.jpg", alt: "Third slide" },
];

export default function HostelDetails() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='maincontainer'>
      <div className="navbar">
        <h1 className='heading'>Home</h1>
        <div className="nav-Details">
          <h1>Warden Name</h1>
          <h1>Contact Number</h1>
          <h1>Email</h1>
        </div>
      </div>

      <div className='right-section'>
        <div className="hostel-Pic">
          <img src="/src/assets/Hostelimage.jpg" alt="Hostel image" className="hostel-image" />
          <h2 className="hostel-name">Hostel Name</h2>
        </div>

        <div className="description">
          <h1 className='h-description'>Description</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat soluta iure corporis accusamus illum nobis, porro ipsum reprehenderit a tempore tempora assumenda, modi aperiam dolores non amet! Vitae, animi delectus?</p>
        </div>

        <div className="available-rooms">
          <h1 className='c-heading'>Available Rooms</h1>
        </div>

        <div className="container">
          <div className="div-container">
            <div className="upper">1 person</div>
            <div className="lower">Rent:2000</div>
          </div>
          <div className="div-container">
            <div className="upper">2 sharing</div>
            <div className="lower">Rent:1700</div>
          </div>
          <div className="div-container">
            <div className="upper">3 sharing</div>
            <div className="lower">Rent:1500</div>
          </div>
          <div className="div-container">
            <div className="upper">4 sharing</div>
            <div className="lower">Rent:1300</div>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="carousel-container">
          <div className="carousel-slide">
            <img src={images[currentIndex].src} alt={images[currentIndex].alt} className="carousel-image" />
          </div>
          <button className="carousel-control prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="carousel-control next" onClick={nextSlide}>
            &#10095;
          </button>
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

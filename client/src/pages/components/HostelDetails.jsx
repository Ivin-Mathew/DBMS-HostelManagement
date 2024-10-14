import { useState } from 'react';

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
    <div className="grid grid-cols-[1fr_6fr] h-screen">
      <div className="flex flex-col bg-aqua items-center fixed top-0 left-0 w-48 z-10">
        <h1 className=" font-black text-2xl text-center m-2">Home</h1>
        <div className="flex flex-col items-center justify-center mt-16 gap-5">
          <h1>Warden Name</h1>
          <h1>Contact Number</h1>
          <h1>Email</h1>
        </div>
      </div>

      <div className="flex flex-col items-center ml-48 p-5">
        <div className="flex flex-col items-center w-72">
          <img src="/src/assets/Hostelimage.jpg" alt="Hostel image" className="w-full h-auto rounded-lg object-cover" />
          <h2 className="mt-2 text-lg font-bold text-center">Hostel Name</h2>
        </div>

        <div className="mt-12 w-full text-left">
          <h1 className="font-bold text-lg">Description</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat soluta iure corporis accusamus illum nobis, porro ipsum reprehenderit a tempore tempora assumenda, modi aperiam dolores non amet! Vitae, animi delectus?</p>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-lg">Available Rooms</h1>
        </div>

        <div className="flex justify-around w-full mt-5">
          <div className="w-36 h-24 border border-gray-300 mx-5">
            <div className="bg-green-500 h-1/2 flex justify-center items-center text-white">1 person</div>
            <div className="bg-blue-500 h-1/2 flex justify-center items-center text-white">Rent: 2000</div>
          </div>
          <div className="w-36 h-24 border border-gray-300 mx-5">
            <div className="bg-green-500 h-1/2 flex justify-center items-center text-white">2 sharing</div>
            <div className="bg-blue-500 h-1/2 flex justify-center items-center text-white">Rent: 1700</div>
          </div>
          <div className="w-36 h-24 border border-gray-300 mx-5">
            <div className="bg-green-500 h-1/2 flex justify-center items-center text-white">3 sharing</div>
            <div className="bg-blue-500 h-1/2 flex justify-center items-center text-white">Rent: 1500</div>
          </div>
          <div className="w-36 h-24 border border-gray-300 mx-5">
            <div className="bg-green-500 h-1/2 flex justify-center items-center text-white">4 sharing</div>
            <div className="bg-blue-500 h-1/2 flex justify-center items-center text-white">Rent: 1300</div>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative w-full max-w-xl mx-auto overflow-hidden mt-5">
          <div className="flex justify-center items-center transition-transform duration-500 ease-in-out">
            <img src={images[currentIndex].src} alt={images[currentIndex].alt} className="w-full h-auto" />
          </div>
          <button className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 border-none p-2 cursor-pointer z-1" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 border-none p-2 cursor-pointer z-1" onClick={nextSlide}>
            &#10095;
          </button>
          <div className="flex justify-center mt-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${index === currentIndex ? 'bg-gray-500' : 'bg-gray-300'} cursor-pointer`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

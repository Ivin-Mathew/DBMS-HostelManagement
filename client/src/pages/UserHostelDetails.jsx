// src/components/UserHostelDetails.jsx

import { useState, useEffect } from "react";
import { supabase } from "../Supabase"; // Ensure correct path
import { useNavigate } from "react-router-dom";
import ActivityIndicator from "../components/ActivityIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";

const UserHostelDetails = () => {
  const navigate = useNavigate(); // For redirection
  const [hostel, setHostel] = useState(null);
  const [warden,setWarden] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState(null); // To display success/error messages
  const [isOpen, setIsOpen] = useState(false);

  const images = [
    { src: "/src/assets/Hostelimage.jpg", alt: "First slide" },
    { src: "/src/assets/Hostelimage2.jpg", alt: "Second slide" },
    { src: "/src/assets/Hostelimage3.jpg", alt: "Third slide" },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const fetchUserDetails = async () => {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      alert("Error fetching user information.");
      setLoading(false);
      return;
    }

    if (!user) {
      alert("You must be logged in to access this page.");
      navigate("/login"); // Redirect to login if not authenticated
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.user.id)
    .single(); // Fetch the user details

  if (error) {
    console.error("Error fetching user details:", error);
    alert("Failed to fetch user details.");
    setLoading(false);
  } else {
    fetchHostelDetails(data.hostelid);
    fetchRoomDetails(data.roomid);
  }
  };

  const fetchHostelDetails = async (hostelId) => {
    const { data, error } = await supabase
      .from("hostels")
      .select("*")
      .eq("hostelid", hostelId)
      .single();

    if (error) {
      console.error("Error fetching hostel details:", error);
      alert("Failed to fetch hostel details.");
    } else {
      setHostel(data);
      fetchWardenDetails(data.wardenid);
    }
    setLoading(false);
  };

  const fetchRoomDetails = async (roomId) => {
    const { data, error } = await supabase
      .from("hostelroomdetails")
      .select("*")
      .eq("roomid", roomId)
      .single();

    if (error) {
      console.error("Error fetching room details:", error);
      alert("Failed to fetch room details.");
    } else {
      setRoom(data);
    }
    setLoading(false);
  };

  const fetchWardenDetails = async (wardenId) =>{
    const{data,error} = await supabase
    .from("wardens")
    .select("*")
    .eq("wardenid",wardenId)
    .single();

    if (error) {
      console.error("Error fetching room details:", error);
      alert("Failed to fetch room details.");
    } else {
      setWarden(data);
    }
    setLoading(false);

  }

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (isOpen) {
      gsap.to(sidebar, { width: "0px", duration: 0 }); // Collapse
    } else {
      gsap.to(sidebar, { width: "300px", duration: 0 }); // Expand
    }
    setIsOpen(!isOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ActivityIndicator />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-xl">Hostel not found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[100dvh]">
      {/* Sidebar */}
      <div
        className="flex flex-col 
        bg-[#353535] text-white backdrop-filter backdrop-blur-sm 
        items-center justify-center text-center h-screen 
        sticky top-0 left-0  sidebar 
        transition-all duration-300"
      >
        <div className="flex flex-col items-center justify-center px-[12px] gap-10">
          <h2 className="text-lg hover:text-white">
            {isOpen && `Warden Name : ${warden.name}`}
          </h2>
          <h2 className="text-lg hover:text-white">
            {isOpen && `Warden Contact : ${warden.contact}`}
          </h2>
          <h2 className="text-lg hover:text-white">
          {isOpen && `Warden Email : ${warden.email}`}
            </h2>
          <h2
            className="text-lg hover:text-white text-red-600"
            onClick={() => navigate("/search")}
          >
            {isOpen && "Back"}
          </h2>
        </div>
      </div>

      <button
        className="fixed top-6 left-6 bg-[#daa510] p-3 rounded-full w-14 h-14 z-20 hover:bg-[#e6b854] focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 flex items-center justify-center"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <FontAwesomeIcon
            icon={faClose}
            style={{ color: "black" }}
            size="lg"
          />
        ) : (
          <FontAwesomeIcon icon={faBars} style={{ color: "black" }} size="lg" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen w-full">
        {/* Hostel Image and Name */}
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center">
            {hostel.name}
          </h2>
        </div>

        {/* Description */}
        {hostel.description && (
          <div className="mt-8 w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Description</h3>
            <p className="text-lg text-gray-700">
              {hostel.description || "No description available."}
            </p>
          </div>
        )}

        {/* Display Success/Error Messages */}
        {message && (
          <div
            className={`mt-4 max-w-2xl mx-auto p-4 rounded-lg shadow-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Image Carousel */}
        <div className="relative w-full max-w-xl mx-auto mt-10">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-64 object-cover duration-200 ease-in-out"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-90 p-3 rounded-r-md shadow-md transition"
            onClick={prevSlide}
          >
            &#10094;
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-90 p-3 rounded-l-md shadow-md transition"
            onClick={nextSlide}
          >
            &#10095;
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? "bg-gray-800" : "bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
          </div>
        </div>

        {/* Room Details */}
        {room && (
          <div className="mt-8 w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Room Details</h3>
            <p className="text-lg text-gray-700">
              <strong>Room Type:</strong> {room.roomType}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Vacancies:</strong> {room.vacancies}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Rent Due Date:</strong> {new Date(room.rentduedate).toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Rent:</strong> ₹{room.rent}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHostelDetails;
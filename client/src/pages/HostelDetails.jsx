// src/components/HostelDetails.jsx

import { useState, useEffect } from "react";
import { supabase } from "../Supabase"; // Ensure correct path
import { useParams, Link, useNavigate } from "react-router-dom";
import { applyToRoom } from "../components/ApplyRoom"; // Import the applyToRoom function
import ActivityIndicator from "../components/ActivityIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";

const HostelDetails = () => {
  const { hostelid } = useParams();
  const navigate = useNavigate(); // For redirection
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applyingRoomId, setApplyingRoomId] = useState(null); // To track which room is being applied to
  const [message, setMessage] = useState(null); // To display success/error messages
  const [showConfirmModal, setShowConfirmModal] = useState(false); // To control confirmation modal
  const [selectedRoom, setSelectedRoom] = useState(null); // To store the room being applied to
  const [isApplying, setIsApplying] = useState(false); // To show loading overlay during application
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

  const fetchHostelDetails = async () => {
    const { data, error } = await supabase
      .from("hostels")
      .select("*")
      .eq("hostelid", hostelid)
      .single();

    if (error) {
      console.error("Error fetching hostel details:", error);
      alert("Failed to fetch hostel details.");
      setLoading(false);
    } else {
      setHostel(data);
      fetchRooms(data.hostelid);
    }
  };

  const fetchRooms = async (hostelId) => {
    const { data, error } = await supabase
      .from("hostelroomdetails")
      .select("*")
      .eq("hostelid", hostelId);

    if (error) {
      console.error("Error fetching rooms:", error);
      alert("Failed to fetch rooms.");
    } else {
      setRooms(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hostelid) {
      fetchHostelDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelid]);

  // Function to handle applying to a room after confirmation
  const confirmApplyToRoom = async () => {
    if (!selectedRoom) return;

    setShowConfirmModal(false);
    setIsApplying(true);
    setMessage(null); // Reset any existing messages

    // Call the applyToRoom function from applyRoom.js
    const result = await applyToRoom({
      hostelId: hostel.hostelid,
      roomId: selectedRoom.roomid,
    });

    if (result.success) {
      // Update the local state to reflect the changes
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.roomid === selectedRoom.roomid
            ? { ...r, vacancies: r.vacancies - 1 }
            : r
        )
      );

      setMessage({ type: "success", text: result.message });

      // Redirect to /userHome after a short delay to show the success message
      setTimeout(() => {
        navigate("/userHome");
      }, 2000); // 2 seconds delay
    } else {
      setMessage({ type: "error", text: result.message });
    }

    setIsApplying(false); // Reset the applying state
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (isOpen) {
      gsap.to(sidebar, { width: "0px", duration: 0 }); // Collapse
    } else {
      gsap.to(sidebar, { width: "300px", duration: 0 }); // Expand
    }
    setIsOpen(!isOpen);
  };

  // Function to handle clicking the "Apply" button
  const handleApplyClick = (room) => {
    setSelectedRoom(room);
    setShowConfirmModal(true);
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
    <div className="relative min-h-screen ">
      {/* Sidebar */}
      <div
        className="fixed flex flex-col justify-center left-0  bg-gray-600 bg-opacity-50 backdrop-filter backdrop-blur-sm items-center h-screen  top-0 col-span-1 sidebar transition-all duration-300 z-10"
        style={{ width: "0px" }}
      >
        {/* <h1 className="font-bold text-2xl mb-6">Home</h1> */}
        <div className="flex flex-col items-center justify-center mt-16 gap-10">
          <h2 className="text-lg text-white hover:cursor-pointer">
            {isOpen && "Warden Name"}
          </h2>
          <h2 className="text-lg text-white hover:cursor-pointer">
            {isOpen && "Contact Number"}
          </h2>
          <h2 className="text-lg text-white hover:cursor-pointer">{isOpen && "Email"}</h2>
          <h2
            className="text-lg hover:text-white hover:cursor-pointer text-red-600"
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
      <div className="flex flex-col items-center bg-[#353535] justify-center p-6  min-h-screen">
        {/* Hostel Image and Name */}
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">
          <div className="w-full h-64 overflow-hidden rounded-lg shadow-lg">
            <img
              src={`https://cktahfosepepxjmynuuz.supabase.co/storage/v1/object/public/thumbnails/${hostel.name}/${hostel.thumbnail}` || "https://via.placeholder.com/600x400"}
              alt="Hostel"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold text-white text-center">
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

        {/* Available Rooms */}
        <div className="mt-8 w-full max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-white">Available Rooms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rooms.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">
                No rooms available.
              </p>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.roomid}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
                >
                  <h4 className="text-xl font-semibold mb-3 text-gray-800">
                    {room.roomType}
                  </h4>
                  <p className="text-gray-600">
                    <strong>Max Occupants:</strong> {room.maxoccupants}
                  </p>
                  <p className="text-gray-600">
                    <strong>Vacancies:</strong> {room.vacancies}
                  </p>
                  <p className="text-gray-600">
                    <strong>Rent/Person:</strong> ₹{room.rentperperson}
                  </p>
                  <button
                    onClick={() => handleApplyClick(room)}
                    className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-150 ease-in-out ${
                      applyingRoomId === room.roomid || isApplying
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={applyingRoomId === room.roomid || isApplying}
                  >
                    {applyingRoomId === room.roomid ? "Applying..." : "Apply"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Image Carousel */}
        {/* <div className="relative w-full max-w-xl mx-auto mt-10">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-64 object-cover duration-200 ease-in-out"
            />
          </div> */}

          {/* Navigation Buttons */}
          {/* <button
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
          </button> */}

          {/* Indicators */}
          {/* <div className="flex justify-center mt-4 space-x-2">
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
        </div>  */}
      </div>

      {/* Back Button */}
      {/* <div className="mt-8">
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Back to Search
          </Link>
        </div> */}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedRoom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4">Confirm Application</h2>
            <p className="mb-6">
              Are you sure you want to enroll into the "{selectedRoom.roomType}"
              room?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={confirmApplyToRoom}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isApplying && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="text-xl">Applying...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelDetails;

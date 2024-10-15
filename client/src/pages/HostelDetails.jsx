// src/components/HostelDetails.jsx

import { useState, useEffect } from 'react';
import { supabase } from '../Supabase'; // Ensure correct path
import { useParams, Link, useNavigate } from 'react-router-dom';
import { applyToRoom } from '../components/ApplyRoom'; // Import the applyToRoom function

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
      .from('hostels')
      .select('*')
      .eq('hostelid', hostelid)
      .single();

    if (error) {
      console.error('Error fetching hostel details:', error);
      alert('Failed to fetch hostel details.');
      setLoading(false);
    } else {
      setHostel(data);
      fetchRooms(data.hostelid);
    }
  };

  const fetchRooms = async (hostelId) => {
    const { data, error } = await supabase
      .from('hostelroomdetails')
      .select('*')
      .eq('hostelid', hostelId);

    if (error) {
      console.error('Error fetching rooms:', error);
      alert('Failed to fetch rooms.');
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
          r.roomid === selectedRoom.roomid ? { ...r, vacancies: r.vacancies - 1 } : r
        )
      );

      setMessage({ type: 'success', text: result.message });

      // Redirect to /userHome after a short delay to show the success message
      setTimeout(() => {
        navigate('/userHome');
      }, 2000); // 2 seconds delay
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setIsApplying(false); // Reset the applying state
  };

  // Function to handle clicking the "Apply" button
  const handleApplyClick = (room) => {
    setSelectedRoom(room);
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-xl">Loading...</span>
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
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[25rem] bg-blue-700 p-5 text-black fixed top-0 left-0 h-full flex flex-col items-center">
        <h1 className="font-bold text-2xl mb-6">Home</h1>
        <div className="flex flex-col items-center justify-center mt-16 gap-4">
          <h2 className="text-lg">Warden Name</h2>
          <h2 className="text-lg">Contact Number</h2>
          <h2 className="text-lg">Email</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-48 p-6 flex-1 bg-gray-100 overflow-y-auto">
        {/* Hostel Image and Name */}
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
          <img
            src={hostel.image_url || 'https://via.placeholder.com/600x400'}
            alt="Hostel"
            className="w-full h-64 rounded-lg object-cover shadow-lg"
          />
          <h2 className="mt-4 text-3xl font-bold text-center">{hostel.name}</h2>
        </div>

        {/* Description */}
        <div className="mt-8 w-full max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700">
            {hostel.description || 'No description available.'}
          </p>
        </div>

        {/* Display Success/Error Messages */}
        {message && (
          <div
            className={`mt-4 max-w-2xl mx-auto p-4 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Available Rooms */}
        <div className="mt-8 w-full max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Available Rooms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">No rooms available.</p>
            ) : (
              rooms.map((room) => (
                <div key={room.roomid} className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="text-xl font-medium mb-2">{room.roomType}</h4>
                  <p className="text-gray-600"><strong>Max Occupants:</strong> {room.maxoccupants}</p>
                  <p className="text-gray-600"><strong>Vacancies:</strong> {room.vacancies}</p>
                  <p className="text-gray-600"><strong>Rent/Person:</strong> ₹{room.rentperperson}</p>
                  <button
                    onClick={() => handleApplyClick(room)}
                    className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${
                      applyingRoomId === room.roomid || isApplying ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={applyingRoomId === room.roomid || isApplying}
                  >
                    {applyingRoomId === room.roomid ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative w-full max-w-xl mx-auto mt-8">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-64 object-cover transition-transform duration-500 ease-in-out"
            />
          </div>
          {/* Navigation Buttons */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-75 p-2 rounded-r"
            onClick={prevSlide}
          >
            &#10094;
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-75 p-2 rounded-l"
            onClick={nextSlide}
          >
            &#10095;
          </button>
          {/* Indicators */}
          <div className="flex justify-center mt-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Back to Search
          </Link>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedRoom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4">Confirm Application</h2>
            <p className="mb-6">Are you sure you want to enroll into the "{selectedRoom.roomType}" room?</p>
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

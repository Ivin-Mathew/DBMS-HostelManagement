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
  const [message] = useState(null);
  const [isOpen, setIsOpen] = useState(false);


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
            {isOpen &&
            <div>
              <p>Warden Name:</p>
              <p>{warden.name}</p>
            </div>
            }
          </h2>
          <h2 className="text-lg hover:text-white">
          {isOpen &&
            <div>
              <p>Warden Contact:</p>
              <p>{warden.contact}</p>
            </div>
            }          </h2>
          <h2 className="text-lg hover:text-white">
          {isOpen &&
            <div>
              <p>Warden Email:</p>
              <p>{warden.email}</p>
            </div>
            }            
          </h2>
            {isOpen &&
            <div
              className="text-lg hover:text-black font-bold bg-red-600 
              py-3 px-8 
              border-[1px] border-slate-300 rounded-xl"
              onClick={() => navigate("/userHome")}
            >
              Back
            </div>
            }
          
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
      <div className="flex flex-col items-center justify-center p-6 bg-surface text-white min-h-screen w-full">
        {/* Hostel Image and Name */}
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl font-bold text-gray-100 text-center">
            {hostel.name}
          </h2>
        </div>

        <div className="w-[50%] h-64 my-12 overflow-hidden rounded-lg shadow-lg shadow-slate-400 bg-mixed">
          <img
            // eslint-disable-next-line no-constant-binary-expression
            src={`https://cktahfosepepxjmynuuz.supabase.co/storage/v1/object/public/thumbnails/${hostel.name}/${hostel.thumbnail}` || "https://via.placeholder.com/600x400"}
            alt="Hostel"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        {hostel.description && (
          <div className="mt-8 w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Description</h3>
            <p className="text-lg">
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

        {/* Room Details */}
        {room && (
          <div className="w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Room Details</h3>
            <p className="text-lg">
              <strong>Room ID:</strong> {room.roomid}
            </p>
            <p className="text-lg">
              <strong>Vacancies:</strong> {room.vacancies}
            </p>
            <p className="text-lg">
              <strong>Rent Due Date:</strong> {new Date(room.rentduedate).toLocaleDateString()}
            </p>
            <p className="text-lg">
              <strong>Rent:</strong> ₹{room.rentperperson}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHostelDetails;
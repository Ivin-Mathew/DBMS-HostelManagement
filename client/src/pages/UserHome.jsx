// src/components/UserHome.jsx

import { useState, useEffect } from "react";
import { supabase } from "../Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHotel,
  faMoneyBill,
  faBars,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ActivityIndicator from "../components/ActivityIndicator";
import { gsap } from "gsap";

function UserHome() {
  const [userDetails, setUserDetails] = useState({
    name: "Not Found",
    address: "Not Found",
    email: "Not Found",
    contact: "Not Found",
    age: "Not Found",
    gender: "Not Found",
    profession: "Not Found",
    hostelId: "Not Found",
    roomId: "Not Found",
  });

  const [hostel, setHostel] = useState(null);
  const [room, setRoom] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [Loading, isLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        isLoading(true);
        // 1. Get the current authenticated user
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authData.user) {
          console.error("Error fetching user:", authError);
          navigate("/");
          return;
        }

        const userId = authData.user.id;

        // 2. Fetch user details from 'users' table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError) {
          console.error("Error fetching user details:", userError);
          navigate("/"); // Redirect if user data cannot be fetched
          return;
        }

        // 3. Update user details state
        setUserDetails({
          name: userData.name || "Not Found",
          address: userData.address || "Not Found",
          email: userData.email || "Not Found",
          contact: userData.contact || "Not Found",
          age: userData.age || "Not Found",
          gender: userData.gender || "Not Found",
          profession: userData.profession || "Not Found",
          hostelId: userData.hostelid || "Not Found",
          roomId: userData.roomid || "Not Found",
        });

        // 4. Fetch hostel details using hostelId from user data
        if (userData.hostelid) {
          const { data: hostelData, error: hostelError } = await supabase
            .from("hostels")
            .select("*")
            .eq("hostelid", userData.hostelid)
            .single();

          if (hostelError) {
            console.error("Error fetching hostel details:", hostelError);
            setHostel(null);
          } else {
            setHostel(hostelData);
          }
        }

        // 5. Fetch room details using roomId from user data
        if (userData.roomid) {
          const { data: roomData, error: roomError } = await supabase
            .from("hostelroomdetails")
            .select("*")
            .eq("roomid", userData.roomid)
            .single();

          if (roomError) {
            console.error("Error fetching room details:", roomError);
            setRoom(null);
          } else {
            setRoom(roomData);
          }
        }

        isLoading(false);
      } catch (error) {
        console.error("Unexpected error:", error);
        navigate("/");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const saveData = async () => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        console.error("Error fetching user for update:", authError);
        return;
      }

      const userId = authData.user.id;

      const { error } = await supabase
        .from("users")
        .update({
          name: userDetails.name,
          address: userDetails.address,
          email: userDetails.email,
          contact: userDetails.contact,
          age: userDetails.age,
          gender: userDetails.gender,
          profession: userDetails.profession,
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user details:", error);
        alert("Failed to update user details.");
      } else {
        console.log("User details updated successfully");
        alert("User details updated successfully!");
      }
    } catch (error) {
      console.error("Unexpected error during update:", error);
      alert("An unexpected error occurred while updating.");
    }
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
  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      navigate("/");
    }
  };

  console.log("hostel data: ", hostel);

  console.log("Room data: ", room);
  const formattedRentDueDate = room
    ? new Date(room.rentduedate).toLocaleDateString()
    : "Loading...";

  return (
    <>
      {Loading ? (
        <ActivityIndicator />
      ) : (
        <div className="relative min-h-screen">
          {/* Toggle button */}

          {/* Sidebar */}
          <div
            className="fixed flex flex-col left-0 justify-around bg-[#353535] text-white backdrop-filter backdrop-blur-sm items-center h-screen  top-0 col-span-1 sidebar transition-all duration-300"
            style={{ width: "0px" }}
          >
            {isOpen && (
              <div className="flex items-center mb-6">
                <img
                  src="/logo.png"
                  alt="Warden Dashboard Logo"
                  className="h-24 w-24 mr-4"
                />
              </div>
            )}
            {/* {isOpen && <h1 className="text-center font-black my-2 text-2xl">Home</h1>} */}
            {/* <div className="flex bg-blue w-24 h-24 rounded-full my-2"></div> */}
            <div className="flex flex-col items-center justify-center ">
              {isOpen && (
                <div
                  className="flex items-center gap-2 my-5 hover:text-white hover:cursor-pointer"
                  onClick={() => navigate("/search")}
                >
                  <FontAwesomeIcon icon={faSearch} />
                  <h1>Search</h1>
                </div>
              )}
              {isOpen && (
                <div className="flex items-center gap-2 my-5 hover:text-white hover:cursor-pointer" onClick={()=> navigate("/userHostelDetails")}>
                  <FontAwesomeIcon icon={faHotel} />
                  <h1>Hostel Details</h1>
                </div>
              )}

              {/* {isOpen && (
                <div className="flex items-center gap-2 my-5 hover:text-white">
                  <FontAwesomeIcon icon={faMoneyBill} />
                  <h1>Payment</h1>
                </div>
              )} */}
            </div>
            {isOpen && (
              <button
                className="items-center mt-20  mx-auto block font-medium text-center text-white bg-red-500 border border-transparent rounded py-1 px-2 hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
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
              <FontAwesomeIcon
                icon={faBars}
                style={{ color: "black" }}
                size="lg"
              />
            )}
          </button>

          {/* Main Content */}
          <div className=" flex flex-col items-center justify-center p-6 bg-surface text-white min-h-screen">
            <h1 className="text-center font-black my-2 text-4xl mb-16 text-white">
              Welcome {userDetails.name}!
            </h1>

            {/* Hostel Details */}
            <div className="border-2 border-black grid grid-cols-4 gap-x-5 gap-y-2 items-center w-[60%] p-5 rounded-lg shadow-lg bg-mixed">
              {/* Hostel Name */}
              <div className="contents">
                <label htmlFor="hostelName" className="text-right pr-2">
                  Hostel Name
                </label>
                <input
                  type="text"
                  id="hostelName"
                  name="hostelName"
                  placeholder="Hostel Name"
                  value={hostel ? hostel.name : "Loading..."}
                  readOnly
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Location */}
              <div className="contents">
                <label htmlFor="location" className="text-right pr-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Location"
                  value={hostel ? hostel.address : "Loading..."}
                  readOnly
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Rent */}
              <div className="contents">
                <label htmlFor="rent" className="text-right pr-2">
                  Rent
                </label>
                <input
                  type="text"
                  id="rent"
                  name="rent"
                  placeholder="Rent"
                  value={room ? room.rentperperson : "Loading..."}
                  readOnly
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Rent Due Date */}
              <div className="contents">
                <label htmlFor="rentDueDate" className="text-right pr-2">
                  Rent Due Date
                </label>
                <input
                  type="text"
                  id="rentDueDate"
                  name="rentDueDate"
                  placeholder="Rent Due Date"
                  value={formattedRentDueDate}
                  readOnly
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>
            </div>

            {/* User Details */}
            <div className="border-2 border-black grid grid-cols-4 gap-x-5 gap-y-2 items-center w-[60%] p-2 mt-10 rounded-lg shadow-lg
             bg-mixed">
              {/* Name */}
              <div className="contents">
                <label htmlFor="name" className="text-right pr-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={userDetails.name}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Address */}
              <div className="contents">
                <label htmlFor="address" className="text-right pr-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={userDetails.address}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Email */}
              <div className="contents">
                <label htmlFor="email" className="text-right pr-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={userDetails.email}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Contact */}
              <div className="contents">
                <label htmlFor="contact" className="text-right pr-2">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  placeholder="Contact Number"
                  value={userDetails.contact}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Age */}
              <div className="contents">
                <label htmlFor="age" className="text-right pr-2">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Age"
                  value={userDetails.age}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Gender */}
              <div className="contents">
                <label htmlFor="gender" className="text-right pr-2">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  placeholder="Gender"
                  value={userDetails.gender}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Profession */}
              <div className="contents">
                <label htmlFor="profession" className="text-right pr-2">
                  Profession
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  placeholder="Profession"
                  value={userDetails.profession}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className="p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button
                  className="inline-block font-medium text-center text-white bg-blue-500 border border-transparent rounded py-1 px-2 hover:bg-blue-700"
                  onClick={saveData}
                  disabled={!isEditable} // Disable Save button if not in edit mode
                >
                  Save
                </button>
                <button
                  className="inline-block font-medium text-center text-white bg-blue-500 border border-transparent rounded py-1 px-2 hover:bg-blue-700"
                  onClick={toggleEdit}
                >
                  {isEditable ? "Disable Edit" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserHome;

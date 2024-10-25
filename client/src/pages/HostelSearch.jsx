// HostelSearch.jsx
import { useState, useEffect } from "react";
import { supabase } from "../Supabase"; // Ensure correct path
import { Link } from "react-router-dom";
import { faHotel, faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import ActivityIndicator from "../components/ActivityIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

const HostelSearch = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]); // All hostels fetched from the database
  const [filteredHostels, setFilteredHostels] = useState([]); // Hostels after applying search and filters
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [sortOrder, setSortOrder] = useState(null); // Sort order: 'asc' or 'desc'
  const [loading, isLoading] = useState(false);
  // New state variables for filters
  const [selectedGenders, setSelectedGenders] = useState([]); // Gender filters
  const [messAvailable, setMessAvailable] = useState("All"); // Mess availability filter
  const [isOpen, setIsOpen] = useState(false);
  // Fetch all hostels from Supabase on component mount
  useEffect(() => {
    const fetchHostels = async () => {
      isLoading(true);
      const { data, error } = await supabase.from("hostels").select("*");

      console.log("Supabase Response:", { data, error }); // Add this line for debugging

      if (error) {
        console.error("Error fetching hostels:", error);
        alert("Failed to fetch hostels.");
      } else {
        console.log("Fetched hostels:", data); // Debugging line
        setHostels(data);
        setFilteredHostels(data);
      }
      isLoading(false);
    };

    fetchHostels();
  }, []);

  // Apply search and filters whenever relevant state changes
  useEffect(() => {
    let updatedHostels = [...hostels];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      updatedHostels = updatedHostels.filter((hostel) =>
        hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply gender filters
    if (selectedGenders.length > 0) {
      updatedHostels = updatedHostels.filter((hostel) =>
        selectedGenders.includes(hostel.gender)
      );
    }

    // Apply mess availability filter
    if (messAvailable === "Yes") {
      updatedHostels = updatedHostels.filter(
        (hostel) => hostel.mess_available === true
      );
    } else if (messAvailable === "No") {
      updatedHostels = updatedHostels.filter(
        (hostel) => hostel.mess_available === false
      );
    }
    // If 'All', do not filter based on mess availability

    // Apply sorting
    if (sortOrder) {
      updatedHostels.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.rentPerPerson - b.rentPerPerson;
        } else {
          return b.rentPerPerson - a.rentPerPerson;
        }
      });
    }

    setFilteredHostels(updatedHostels);
    console.log("Filtered hostels:", updatedHostels); // Debugging line
  }, [hostels, searchTerm, selectedGenders, messAvailable, sortOrder]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort button click
  const handleSort = () => {
    // Toggle sort order between ascending and descending
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  // Handle gender checkbox change
  const handleGenderChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedGenders([...selectedGenders, value]);
    } else {
      setSelectedGenders(selectedGenders.filter((gender) => gender !== value));
    }
  };

  // Handle mess availability radio button change
  const handleMessAvailableChange = (e) => {
    setMessAvailable(e.target.value);
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

  return (
    <div className="flex flex-row h-[100dvh]">
      {/* Sidebar */}
      <div
        className="flex flex-col bg-[#353535] text-white backdrop-filter backdrop-blur-sm items-center h-screen sticky top-0 left-0 col-span-1 sidebar transition-all duration-300"
        style={{ width: "0px" }}
      >
        {isOpen && (
          <>
            <div className="mt-36">
            <div className="flex items-center justify-center mt-4 mb-10" onClick={()=>navigate("/userHome")}>
              <img
                src="/logo.png"
                alt="Warden Dashboard Logo"
                className="h-24 w-24"
              />
            </div>
              <h2 className="text-xl font-semibold">Filters</h2>

              {/* Gender Filter */}
              <div className="mt-4">
                <h3 className="text-lg font-medium">Gender</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value="Male"
                        onChange={handleGenderChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                  </li>
                  <li>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value="Female"
                        onChange={handleGenderChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </li>
                  <li>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value="Co-ed"
                        onChange={handleGenderChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2">Co-ed</span>
                    </label>
                  </li>
                </ul>
              </div>

              {/* Mess Availability Filter */}
              <div className="mt-6">
                <h3 className="text-lg font-medium">Mess Availability</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="messAvailable"
                        value="All"
                        checked={messAvailable === "All"}
                        onChange={handleMessAvailableChange}
                        className="form-radio"
                      />
                      <span className="ml-2">All</span>
                    </label>
                  </li>
                  <li>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="messAvailable"
                        value="Yes"
                        checked={messAvailable === "Yes"}
                        onChange={handleMessAvailableChange}
                        className="form-radio"
                      />
                      <span className="ml-2">Mess Available</span>
                    </label>
                  </li>
                  <li>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="messAvailable"
                        value="No"
                        checked={messAvailable === "No"}
                        onChange={handleMessAvailableChange}
                        className="form-radio"
                      />
                      <span className="ml-2">Mess Not Available</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div className="mt-6" onClick={() => {
                navigate('/userHome')
              }}>
                <p className="text-lg text-red-600 hover:text-red-950">Back</p>
              </div>
            </div>
          </>
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
          <FontAwesomeIcon icon={faBars} style={{ color: "black" }} size="lg" />
        )}
      </button>

      {/* Main Content */}
      <div className=" p-4 w-full bg-surface text-white">
        {/* Search and Sort */}
        <div className="flex  justify-center items-center mb-4 mt-4 gap-4 ">
          <input
            type="text"
            placeholder="Search Hostels by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className=" p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500 w-[50%]"
          />
          <button
            onClick={handleSort}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sort By Price{" "}
            {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
          </button>
        </div>

        {/* Hostels Grid */}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <div className="ml-10 mt-20 flex items-center justify-center">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {filteredHostels.length === 0 ? (
                <div className="flex flex-col gap-3 text-center items-center justify-center text-gray-500 col-span-full mt-80">
                  <FontAwesomeIcon icon={faHotel} size="5x" />
                  <p className="text-2xl">No Hostels</p>
                </div>
              ) : (
                filteredHostels.map((hostel) => (
                  <div
                    key={hostel.hostelid}
                    className="border rounded-lg overflow-hidden shadow-md bg-[#29353c]"
                  >
                    {/* Hostel Image */}
                    <img
                      src={
                        hostel.image_url || "https://via.placeholder.com/300x200"
                      }
                      alt={hostel.name}
                      className="w-full h-48 object-cover"
                    />

                    {/* Hostel Details */}
                    <div className="p-4">
                      <h3 className="text-3xl text-center font-bold font-serif my-[10px]">
                        {hostel.name}
                      </h3>
                      {/* <p className="mb-1">
                        <strong>Rent:</strong> ₹{hostel.rentPerPerson}
                      </p> */}
                      <p className="mb-1">
                        <strong>Location:</strong> {hostel.address}
                      </p>
                      <p className="mb-1">
                        <strong>Mess Available:</strong>{" "}
                        {hostel.mess_available ? "Yes" : "No"}
                      </p>
                      <p className="mb-1">
                        <strong>Gender:</strong> {hostel.gender}
                      </p>
                      <p className="mb-1">
                        <strong>Occupant Type:</strong> {hostel.occupanttype}
                      </p>

                      {/* Link to Hostel Details or Booking */}
                      <Link
                        to={`/hostelDetails/${hostel.hostelid}`}
                        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelSearch;

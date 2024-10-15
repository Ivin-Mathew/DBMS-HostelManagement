// HostelSearch.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../Supabase'; // Ensure correct path
import { Link } from 'react-router-dom';

const HostelSearch = () => {
  const [hostels, setHostels] = useState([]); // All hostels fetched from the database
  const [filteredHostels, setFilteredHostels] = useState([]); // Hostels after applying search and filters
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [sortOrder, setSortOrder] = useState(null); // Sort order: 'asc' or 'desc'

  // New state variables for filters
  const [selectedGenders, setSelectedGenders] = useState([]); // Gender filters
  const [messAvailable, setMessAvailable] = useState('All'); // Mess availability filter

  // Fetch all hostels from Supabase on component mount
  useEffect(() => {
    const fetchHostels = async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select('*');
      
      console.log('Supabase Response:', { data, error }); // Add this line for debugging

      if (error) {
        console.error('Error fetching hostels:', error);
        alert('Failed to fetch hostels.');
      } else {
        console.log('Fetched hostels:', data); // Debugging line
        setHostels(data);
        setFilteredHostels(data);
      }
    };

    fetchHostels();
  }, []);

  // Apply search and filters whenever relevant state changes
  useEffect(() => {
    let updatedHostels = [...hostels];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      updatedHostels = updatedHostels.filter(hostel =>
        hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply gender filters
    if (selectedGenders.length > 0) {
      updatedHostels = updatedHostels.filter(hostel =>
        selectedGenders.includes(hostel.gender)
      );
    }

    // Apply mess availability filter
    if (messAvailable === 'Yes') {
      updatedHostels = updatedHostels.filter(hostel => hostel.mess_available === true);
    } else if (messAvailable === 'No') {
      updatedHostels = updatedHostels.filter(hostel => hostel.mess_available === false);
    }
    // If 'All', do not filter based on mess availability

    // Apply sorting
    if (sortOrder) {
      updatedHostels.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.rentPerPerson - b.rentPerPerson;
        } else {
          return b.rentPerPerson - a.rentPerPerson;
        }
      });
    }

    setFilteredHostels(updatedHostels);
    console.log('Filtered hostels:', updatedHostels); // Debugging line
  }, [hostels, searchTerm, selectedGenders, messAvailable, sortOrder]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort button click
  const handleSort = () => {
    // Toggle sort order between ascending and descending
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  // Handle gender checkbox change
  const handleGenderChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedGenders([...selectedGenders, value]);
    } else {
      setSelectedGenders(selectedGenders.filter(gender => gender !== value));
    }
  };

  // Handle mess availability radio button change
  const handleMessAvailableChange = (e) => {
    setMessAvailable(e.target.value);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-blue-900 p-5 text-white overflow-y-auto">
        <div className="flex items-center mb-6">
          <img src="/logo.png" alt="Warden Dashboard Logo" className="h-24 w-24 mr-4" />
        </div>
        <h1 className="text-2xl font-bold mb-8">HOME</h1>
        <div className="mb-4">
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
                    checked={messAvailable === 'All'}
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
                    checked={messAvailable === 'Yes'}
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
                    checked={messAvailable === 'No'}
                    onChange={handleMessAvailableChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Mess Not Available</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-5/6 p-4 overflow-y-auto">
        {/* Search and Sort */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search Hostels by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-5/6 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSort}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sort By Price {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}
          </button>
        </div>

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredHostels.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No hostels found matching your criteria.</p>
          ) : (
            filteredHostels.map(hostel => (
              <div key={hostel.hostelid} className="border rounded-lg overflow-hidden shadow-md">
                {/* Hostel Image */}
                <img
                  src={hostel.image_url || 'https://via.placeholder.com/300x200'}
                  alt={hostel.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Hostel Details */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{hostel.name}</h3>
                  <p className="text-gray-600 mb-1"><strong>Rent:</strong> ₹{hostel.rentPerPerson}</p>
                  <p className="text-gray-600 mb-1"><strong>Location:</strong> {hostel.location}</p>
                  <p className="text-gray-600 mb-1"><strong>Mess Available:</strong> {hostel.mess_available ? 'Yes' : 'No'}</p>
                  <p className="text-gray-600 mb-1"><strong>Gender:</strong> {hostel.gender}</p>
                  <p className="text-gray-600 mb-1"><strong>Occupant Type:</strong> {hostel.occupanttype}</p>
                  
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
    </div>
  );
};

export default HostelSearch;

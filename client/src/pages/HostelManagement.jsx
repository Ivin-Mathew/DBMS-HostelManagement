// HostelManagement.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../Supabase'; // Ensure correct path
import { useNavigate } from 'react-router-dom';

const HostelManagement = () => {
  const navigate = useNavigate();
  const [wardenID, setWardenID] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mess_available: false,
    gender: '',
    occupantType: '',
    max_occupants: 1,
    vacancies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Warden ID based on authenticated user
  const fetchWardenID = async () => {
    const user = supabase.auth.user();

    if (!user) {
      alert('You must be logged in to access this page.');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    // Fetch warden record linked to the current user
    const { data, error } = await supabase
      .from('wardens')
      .select('id')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching warden ID:', error);
      alert('You are not registered as a warden.');
      navigate('/'); // Redirect to home or appropriate page
    } else {
      setWardenID(data.id);
    }
  };

  // Fetch hostel associated with the warden
  const fetchHostel = async () => {
    if (!wardenID) return;

    const { data, error } = await supabase
      .from('hostels')
      .select('*')
      .eq('wardenID', wardenID)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
      console.error('Error fetching hostel:', error);
      alert('Error fetching hostel data.');
    } else if (data) {
      setHostel(data);
      setFormData({
        name: data.name,
        address: data.address,
        mess_available: data.mess_available,
        gender: data.gender,
        occupantType: data.occupantType,
        max_occupants: data.max_occupants,
        vacancies: data.vacancies,
      });
      setIsEditing(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchWardenID();
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wardenID) {
      fetchHostel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wardenID]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { name, address, gender, occupantType, max_occupants } = formData;
    if (!name || !address || !gender || !occupantType || !max_occupants) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isEditing) {
      // Update existing hostel
      const { data, error } = await supabase
        .from('hostels')
        .update({
          name: formData.name,
          address: formData.address,
          mess_available: formData.mess_available,
          gender: formData.gender,
          occupantType: formData.occupantType,
          max_occupants: formData.max_occupants,
          vacancies: formData.vacancies,
        })
        .eq('hostelID', hostel.hostelID);

      if (error) {
        console.error('Error updating hostel:', error);
        alert('Failed to update hostel.');
      } else {
        console.log('Hostel updated:', data);
        alert('Hostel updated successfully!');
        navigate('/wardenHome'); // Redirect to warden dashboard or home
      }
    } else {
      // Create new hostel
      const { data, error } = await supabase
        .from('hostels')
        .insert([
          {
            name: formData.name,
            address: formData.address,
            mess_available: formData.mess_available,
            gender: formData.gender,
            occupantType: formData.occupantType,
            max_occupants: formData.max_occupants,
            vacancies: formData.vacancies,
            wardenID: wardenID,
          },
        ]);

      if (error) {
        console.error('Error creating hostel:', error);
        alert('Failed to create hostel.');
      } else {
        console.log('Hostel created:', data);
        alert('Hostel created successfully!');
        navigate('/wardenHome'); // Redirect to warden dashboard or home
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEditing ? 'Edit Hostel Details' : 'Create New Hostel'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Hostel Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Mess Available */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="mess_available"
              name="mess_available"
              checked={formData.mess_available}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="mess_available" className="ml-2 block text-sm text-gray-700">
              Mess Available
            </label>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Co-ed">Co-ed</option>
            </select>
          </div>

          {/* Occupant Type */}
          <div className="mb-4">
            <label htmlFor="occupantType" className="block text-sm font-medium text-gray-700">
              Occupant Type
            </label>
            <select
              id="occupantType"
              name="occupantType"
              value={formData.occupantType}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Occupant Type</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Max Occupants */}
          <div className="mb-4">
            <label htmlFor="max_occupants" className="block text-sm font-medium text-gray-700">
              Maximum Occupants
            </label>
            <input
              type="number"
              id="max_occupants"
              name="max_occupants"
              value={formData.max_occupants}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Vacancies */}
          <div className="mb-4">
            <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700">
              Vacancies
            </label>
            <input
              type="number"
              id="vacancies"
              name="vacancies"
              value={formData.vacancies}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              {isEditing ? 'Update Hostel' : 'Create Hostel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostelManagement;

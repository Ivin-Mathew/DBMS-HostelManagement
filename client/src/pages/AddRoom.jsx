// AddRoom.jsx
import React, { useState } from 'react';
import { supabase } from '../Supabase'; // Ensure correct path
import { useNavigate, useParams } from 'react-router-dom';

const AddRoom = () => {
  const { hostelID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomType: '',
    rentPerPerson: '',
    rentDueDate: '',
    attachedBathroom: false,
    furnitureAvailable: false,
    acAvailable: false,
  });

  const [loading, setLoading] = useState(false);

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
    const { roomType, rentPerPerson, rentDueDate } = formData;
    if (!roomType || !rentPerPerson || !rentDueDate) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    // Insert room details into hostelRoomDetails table
    const { data, error } = await supabase
      .from('hostelroomdetails')
      .insert([
        {
          hostelid: hostelID,
          maxoccupants: parseInt(roomType, 10),
          vacancies: parseInt(roomType, 10), // Initially, vacancies equal to maxOccupants
          rentperperson: parseFloat(rentPerPerson),
          rentduedate: new Date(rentDueDate).toISOString(),
          attachedbathroom: formData.attachedBathroom,
          furnitureavailable: formData.furnitureAvailable,
          acavailable: formData.acAvailable,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room: ' + error.message);
    } else {
      console.log('Room added:', data);
      alert('Room added successfully!');
      navigate(`/hostelManagement/${hostelID}`); // Redirect back to Hostel Management
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface text-white p-4">
      <div className="bg-mixed p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Add New Room
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Room Type */}
          <div className="mb-4">
            <label htmlFor="roomType" className="block text-sm font-medium">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border bg-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Room Type</option>
              <option value="1">1 Person Room</option>
              <option value="2">2 Person Room</option>
              <option value="3">3 Person Room</option>
              <option value="4">4 Person Room</option>
            </select>
          </div>

          {/* Rent Per Person */}
          <div className="mb-4">
            <label htmlFor="rentPerPerson" className="block text-sm font-medium">
              Rent Per Person
            </label>
            <input
              type="number"
              id="rentPerPerson"
              name="rentPerPerson"
              value={formData.rentPerPerson}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 5000.00"
            />
          </div>

          {/* Rent Due Date */}
          <div className="mb-4">
            <label htmlFor="rentDueDate" className="block text-sm font-medium">
              Rent Due Date
            </label>
            <input
              type="date"
              id="rentDueDate"
              name="rentDueDate"
              value={formData.rentDueDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Attached Bathroom */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="attachedBathroom"
              name="attachedBathroom"
              checked={formData.attachedBathroom}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="attachedBathroom" className="ml-2 block text-sm">
              Attached Bathroom
            </label>
          </div>

          {/* Furniture Available */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="furnitureAvailable"
              name="furnitureAvailable"
              checked={formData.furnitureAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="furnitureAvailable" className="ml-2 block text-sm">
              Furniture Available
            </label>
          </div>

          {/* AC Available */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="acAvailable"
              name="acAvailable"
              checked={formData.acAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="acAvailable" className="ml-2 block text-sm">
              AC Available
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding Room...' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;

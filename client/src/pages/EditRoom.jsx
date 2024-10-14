// EditRoom.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../Supabase'; // Ensure correct path
import { useNavigate, useParams } from 'react-router-dom';

const EditRoom = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [formData, setFormData] = useState({
    roomType: '',
    rentPerPerson: '',
    rentDueDate: '',
    attachedBathroom: false,
    furnitureAvailable: false,
    acAvailable: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Room Details
  const fetchRoom = async () => {
    if (!roomID) return;

    const { data, error } = await supabase
      .from('hostelroomdetails')
      .select('*')
      .eq('roomid', roomID)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
      alert('Error fetching room data.');
    } else if (data) {
      setRoomData(data);
      setFormData({
        roomType: data.maxoccupants.toString(),
        rentPerPerson: data.rentperperson.toString(),
        rentDueDate: data.rentduedate.slice(0, 10), // Format for date input
        attachedBathroom: data.attachedbathroom,
        furnitureAvailable: data.furnitureavailable,
        acAvailable: data.acavailable,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);

  // Handle Form Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { roomType, rentPerPerson, rentDueDate } = formData;
    if (!roomType || !rentPerPerson || !rentDueDate) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    // Update room details
    const { data, error } = await supabase
      .from('hostelroomdetails')
      .update({
        maxOccupants: parseInt(roomType, 10),
        vacancies: parseInt(roomType, 10), // Optionally adjust vacancies
        rentPerPerson: parseFloat(rentPerPerson),
        rentDueDate: new Date(rentDueDate).toISOString(),
        attachedBathroom: formData.attachedBathroom,
        furnitureAvailable: formData.furnitureAvailable,
        acAvailable: formData.acAvailable,
      })
      .eq('roomid', roomID);

    setSubmitting(false);

    if (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room: ' + error.message);
    } else {
      console.log('Room updated:', data);
      alert('Room updated successfully!');
      navigate(`/hostelManagement/${data.hostelid}`); // Redirect back to Hostel Management
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomData) {
    return <div>Room not found.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Room</h2>
        <form onSubmit={handleSubmit}>
          {/* Room Type */}
          <div className="mb-4">
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <label htmlFor="rentPerPerson" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="rentDueDate" className="block text-sm font-medium text-gray-700">
              Rent Due Date
            </label>
            <input
              type="date"
              id="rentDueDate"
              name="rentDueDate"
              value={formData.rentDueDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <label htmlFor="attachedBathroom" className="ml-2 block text-sm text-gray-700">
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
            <label htmlFor="furnitureAvailable" className="ml-2 block text-sm text-gray-700">
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
            <label htmlFor="acAvailable" className="ml-2 block text-sm text-gray-700">
              AC Available
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Updating...' : 'Update Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;

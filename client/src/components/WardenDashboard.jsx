import React, { useState } from 'react';
import './WardenDashboard.css';

const WardenDashboard = () => {
  const [building, setBuilding] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomStatus, setRoomStatus] = useState('');
  const [lastCleaned, setLastCleaned] = useState('');

  const handleAdd = () => {
    // Add room logic
  };

  const handleUpdate = () => {
    // Update room logic
  };

  const handleDelete = () => {
    // Delete room logic
  };

  const handleReset = () => {
    setBuilding('');
    setRoomNumber('');
    setRoomType('');
    setRoomStatus('');
    setLastCleaned('');
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-1/5 bg-blue-900 p-5 text-white">
        <div className="flex items-center mb-6">
          <img src="/logo.png" alt="Warden Dashboard Logo" className="h-36 w-36 mr-10" />
        </div>

        <h1 className="text-2xl mb-6">Warden Dashboard</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <button className="w-full text-left hover:text-blue-300">Hostel Details</button>
            </li>
            <li className="mb-4">
              <button className="w-full text-left hover:text-blue-300">Occupant List</button>
            </li>
            <li className="mb-4">
              <button className="w-full text-left hover:text-blue-300">Warden Details</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Right Content Area */}
      <main className="w-4/5 flex flex-col">
        {/* Room Details Section */}
        <div className="flex-grow bg-gray-100 p-5">
          <h2 className="text-lg font-semibold mb-4">Room Details</h2>
          <div className="bg-white shadow-md rounded p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="building">
                Building
              </label>
              <input
                type="text"
                id="building"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter building name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomNumber">
                Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter room number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomType">
                Room Type
              </label>
              <select
                id="roomType"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select room type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomStatus">
                Room Status
              </label>
              <input
                type="text"
                id="roomStatus"
                value={roomStatus}
                onChange={(e) => setRoomStatus(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter room status"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastCleaned">
                Last Cleaned
              </label>
              <input
                type="date"
                id="lastCleaned"
                value={lastCleaned}
                onChange={(e) => setLastCleaned(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WardenDashboard;
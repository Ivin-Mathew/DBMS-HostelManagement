import React from 'react';

const HostelSearch = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-blue-900 p-5 text-white">
      <div className="flex items-center mb-6">
          <img src="/logo.png" alt="Warden Dashboard Logo" className="h-24 w-24 mr-4" />
        </div>
        <h1 className="text-2x1 font-bold mb-8 text-white">HOME</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Filters</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-white">Budget</label>
            <input type="range" min="0" max="20000" className="w-full mt-2" />
            <div className="flex justify-between text-white text-white">
              <span>₹0</span>
              <span>₹20000</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-white font-medium">Room Type</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2">1 Bed</span>
                </label>
              </li>
              <li>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2">2 Beds</span>
                </label>
              </li>
              <li>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2">3+ Beds</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-5/6 p-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-5/6 p-2 border border-gray-300 rounded"
          />
          <button className="p-2 bg-blue-500 text-blue rounded">Sort By Price</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border p-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Hostel"
                className="w-full h-32 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold">Hostel Name</h3>
              <p className="text-sm text-gray-600">Rent</p>
              <p className="text-sm text-gray-600">Location</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostelSearch;

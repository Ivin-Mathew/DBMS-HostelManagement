import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHotel, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import './UserHome.css';

function UserHome() {
  const [inputs, setInputs] = useState({
    hostelName: '',
    location: '',
    roomId: '',
    contractUpto: '',
    rent: '',
    rentDueDate: '',
    name: '',
    address: '',
    email: '',
    contact: '',
    age: '',
    gender: '',
    profession: ''
  });

  const [isEditable, setIsEditable] = useState(false);

  const fillInputs = () => {
    setInputs({
      hostelName: 'Sunset Hostel',
      location: 'Downtown',
      roomId: '101',
      contractUpto: '2025-12-31',
      rent: '500',
      rentDueDate: '2024-10-31',
      name: 'John Doe',
      address: '123 Main St',
      email: 'john@example.com',
      contact: '1234567890',
      age: '25',
      gender: 'Male',
      profession: 'Student'
    });
  };

  const saveData = () => {
    console.log('Data saved:', inputs);
    alert('Data saved! Check console for details.');
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  return (
    <>
      <div className="maincontainer">
        <div className='userNavbar'>
          <h1 className='heading'>Home</h1>
          <div className='userPic'></div>
          <div className='navbar-details'>
            <div className='search nav'>
              <FontAwesomeIcon icon={faSearch} />
              <h1>Search</h1>
            </div>
            <div className="hostel-Details nav">
              <FontAwesomeIcon icon={faHotel} />
              <h1>Hostel Details</h1>
            </div>
            <div className="payment-History nav">
              <FontAwesomeIcon icon={faMoneyBill} />
              <h1>Payment</h1>
            </div>
          </div>
        </div>

        <div className='welcome-user'>
          <h1 className='heading'>Welcome User!</h1>

          <div className="occupancy-details">
            <div className="form-Group">
              <label htmlFor="hostelName">Hostel Name</label>
              <input
                type="text"
                id="hostelName"
                name="hostelName"
                placeholder="some text"
                value={inputs.hostelName}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="some text"
                value={inputs.location}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="roomId">RoomId</label>
              <input
                type="text"
                id="roomId"
                name="roomId"
                placeholder="some text"
                value={inputs.roomId}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="contractUpto">Contract Upto</label>
              <input
                type="text"
                id="contractUpto"
                name="contractUpto"
                placeholder="some text"
                value={inputs.contractUpto}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="rent">Rent</label>
              <input
                type="text"
                id="rent"
                name="rent"
                placeholder="some text"
                value={inputs.rent}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="rentDueDate">Rent Due Date</label>
              <input
                type="text"
                id="rentDueDate"
                name="rentDueDate"
                placeholder="some text"
                value={inputs.rentDueDate}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
          </div>

          <div className="user-details occupancy-details">
            <div className="form-Group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="some text"
                value={inputs.name}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="some text"
                value={inputs.address}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="some text"
                value={inputs.email}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="contact">Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="some text"
                value={inputs.contact}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                placeholder="some text"
                value={inputs.age}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="gender">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                placeholder="some text"
                value={inputs.gender}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="form-Group">
              <label htmlFor="profession">Profession</label>
              <input
                type="text"
                id="profession"
                name="profession"
                placeholder="some text"
                value={inputs.profession}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
          </div>
           <div className="button-group">
          <button className='btn btn-primary' onClick={fillInputs}>Fill Inputs</button>
          <button className='btn btn-primary' onClick={saveData}>Save</button>
          <button className='btn btn-primary' onClick={toggleEdit}>{isEditable ? 'Disable Edit' : 'Edit'}</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHome;

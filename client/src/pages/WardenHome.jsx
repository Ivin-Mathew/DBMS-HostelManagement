import { useState, useEffect } from 'react';
import { supabase } from '../Supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHotel, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function WardenHome() {
  const [inputs, setInputs] = useState({
    name: 'Not Found',
    address: 'Not Found',
    email: 'Not Found',
    contact: 'Not Found',
    age: 'Not Found',
    gender: 'Not Found',
    id:'',
  });

  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        navigate("/");
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('wardens')
          .select('*')
          .eq('wardenid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user details:', error);
          navigate('/wardenLogin');
        } else {
          setInputs(prevInputs => ({
            ...prevInputs,
            name: data.name,
            address: data.address,
            email: data.email,
            contact: data.contact,
            age: data.age,
            gender: data.gender,
            id:data.wardenid,
          }));
        }
      } else {
        navigate("/wardenLogin");
      }
    };

    fetchUserDetails();
  }, []);

  const saveData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('wardens')
        .update({
          name: inputs.name,
          address: inputs.address,
          email: inputs.email,
          contact: inputs.contact,
          age: inputs.age,
          gender: inputs.gender,
          profession: inputs.profession
        })
        .eq('wardenid', user.id);

      if (error) {
        console.error('Error updating user details:', error);
        alert("Error updating warden details");
      } else {
        console.log('User details updated successfully');
        alert('User details updated successfully!');
      }
    }
  };
  console.log(inputs.id);

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-1">
        <div className='flex flex-col bg-blue-500 items-center h-screen sticky top-0 col-span-1'>
          <h1 className='text-center font-black my-2 text-2xl'>Home</h1>
          <div className='flex bg-blue w-24 h-24 rounded-full my-2'></div>
          <div className='flex flex-col items-center justify-center mt-16'>
            <div className='flex items-center gap-2 my-5'>
              <FontAwesomeIcon icon={faSearch} />
              <h1>View Inmates</h1>
            </div>
            <div className="flex items-center gap-2 my-5 hover:cursor-pointer hover:text-white" onClick={()=> navigate(`/hostelManagement/${inputs.id}`)}>
              <FontAwesomeIcon icon={faHotel} />
              <h1>Hostel Details</h1>
            </div>
            <div className="flex items-center gap-2 my-5">
              <FontAwesomeIcon icon={faMoneyBill} />
              <h1>Payment Manager</h1>
            </div>
          </div>
          <button
            className='mt-auto mb-4 inline-block font-medium text-center text-white bg-red-500 border border-transparent rounded py-1 px-2 hover:bg-red-700'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className='flex flex-col items-center gap-5 ml-8 justify-center col-span-3'>
          <h1 className='text-center font-black my-2 text-2xl'>Welcome WardenName!</h1>

          {/* <div className="border-2 border-black grid grid-cols-4 gap-x-5 gap-y-2 items-center w-[85%] p-2 rounded-lg shadow-lg bg-white">
            <div className="contents">
              <label htmlFor="hostelName" className="text-right pr-2">Hostel Name</label>
              <input
                type="text"
                id="hostelName"
                name="hostelName"
                placeholder="some text"
                value={inputs.hostelName}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="location" className="text-right pr-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="some text"
                value={inputs.location}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="roomId" className="text-right pr-2">RoomId</label>
              <input
                type="text"
                id="roomId"
                name="roomId"
                placeholder="some text"
                value={inputs.roomId}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="contractUpto" className="text-right pr-2">Contract Upto</label>
              <input
                type="text"
                id="contractUpto"
                name="contractUpto"
                placeholder="some text"
                value={inputs.contractUpto}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="rent" className="text-right pr-2">Rent</label>
              <input
                type="text"
                id="rent"
                name="rent"
                placeholder="some text"
                value={inputs.rent}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="rentDueDate" className="text-right pr-2">Rent Due Date</label>
              <input
                type="text"
                id="rentDueDate"
                name="rentDueDate"
                placeholder="some text"
                value={inputs.rentDueDate}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div> */}

          <div className="border-2 border-black grid grid-cols-4 gap-x-5 gap-y-2 items-center w-[85%] p-2 mt-10 rounded-lg shadow-lg bg-white">
            <div className="contents">
              <label htmlFor="name" className="text-right pr-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="some text"
                value={inputs.name}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="address" className="text-right pr-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="some text"
                value={inputs.address}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="email" className="text-right pr-2">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="some text"
                value={inputs.email}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="contact" className="text-right pr-2">Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="some text"
                value={inputs.contact}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="age" className="text-right pr-2">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                placeholder="some text"
                value={inputs.age}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="contents">
              <label htmlFor="gender" className="text-right pr-2">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                placeholder="some text"
                value={inputs.gender}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button className='inline-block font-medium text-center text-white bg-blue-500 border border-transparent rounded py-1 px-2 hover:bg-blue-700' onClick={saveData}>Save</button>
              <button className='inline-block font-medium text-center text-white bg-blue-500 border border-transparent rounded py-1 px-2 hover:bg-blue-700' onClick={toggleEdit}>{isEditable ? 'Disable Edit' : 'Edit'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WardenHome;
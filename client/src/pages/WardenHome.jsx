import { useState, useEffect } from 'react';
import { supabase } from '../Supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHotel, faClose, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { gsap } from "gsap";


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
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="flex flex-row">
        {/* <div className='flex flex-col bg-blue-500 items-center h-screen sticky top-0 col-span-1'>
          <h1 className='text-center font-black my-2 text-2xl'>Home</h1>
          <div className='flex bg-blue w-24 h-24 rounded-full my-2'></div>
          <div className='flex flex-col items-center justify-center mt-16'>
            <div className='flex items-center gap-2 my-5 hover:cursor-pointer hover:text-white' onClick={()=> navigate("/viewInmates")}>
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
        </div> */}

          <div
            className="flex flex-col bg-[#353535] text-white backdrop-filter backdrop-blur-sm items-center sticky top-0 left-0 
            sidebar transition-all duration-300
            py-36"
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
            <div className="flex flex-col items-center justify-center ">
              {isOpen && (
                <div
                  className="flex items-center gap-2 my-5 hover:text-white hover:cursor-pointer"
                  onClick={() => navigate("/viewInmates")}
                >
                  <FontAwesomeIcon icon={faSearch} />
                  <h1>View Inmates</h1>
                </div>
              )}
              {isOpen && (
                <div className="flex items-center gap-2 my-5 hover:cursor-pointer hover:text-white" onClick={()=> navigate(`/hostelManagement/${inputs.id}`)}>
                <FontAwesomeIcon icon={faHotel} />
                <h1>Hostel Details</h1>
                </div>
              )}
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

        <div className="flex flex-col items-center justify-center p-6 bg-surface text-white w-full min-h-screen">
          <h1 className="text-center font-black text-4xl mt-16 md:mt-8 md:mb-16 text-white">Welcome WardenName!</h1>

          <div className="border-2 border-black flex flex-col md:flex-none gap-10 text-left md:grid md:grid-cols-4 md:gap-x-5 md:gap-y-2 items-center w-[85%] p-10 mt-10 rounded-lg shadow-lg bg-mixed">
            <div className="flex flex-col md:flex-row">
              <label htmlFor="name" className="md:text-right pr-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="some text"
                value={inputs.name}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded text-black font-[600] w-[20rem]"
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <label htmlFor="address" className="md:text-right pr-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="some text"
                value={inputs.address}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded text-black font-[600] w-[20rem]"
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <label htmlFor="email" className="md:text-right pr-2">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="some text"
                value={inputs.email}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded text-black font-[600] w-[20rem]"
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <label htmlFor="contact" className="md:text-right pr-2">Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="some text"
                value={inputs.contact}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded text-black font-[600] w-[20rem]"
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <label htmlFor="age" className="md:text-right pr-2">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                placeholder="some text"
                value={inputs.age}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 md:ml-3 border border-gray-300 rounded text-black font-[600] w-[20rem]"
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <label htmlFor="gender" className="md:text-right pr-2">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                placeholder="some text"
                value={inputs.gender}
                onChange={handleChange}
                readOnly={!isEditable}
                className="p-2 border border-gray-300 rounded text-black font-[600] w-[20rem]"
              />
            </div>
            <div className="col-span-4 flex justify-end gap-2 mt-2">
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
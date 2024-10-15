// src/components/ViewInmates.jsx

import React, { useState, useEffect, Fragment } from 'react';
import { supabase } from '../Supabase'; // Ensure correct path
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Dialog, Transition } from '@headlessui/react'; // For modal dialog
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewInmates() {
  const [inmates, setInmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wardenHostelId, setWardenHostelId] = useState(null);
  const [selectedInmate, setSelectedInmate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const navigate = useNavigate(); // Assuming you have react-router setup

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Get the current authenticated user (warden)
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          console.error('Authentication error:', authError);
          toast.error('Authentication failed. Please log in again.');
          navigate('/'); // Redirect to login
          return;
        }

        const wardenId = authData.user.id;

        // 2. Fetch warden's hostelid
        const { data: hostelData, error: hostelError } = await supabase
          .from('hostels')
          .select('hostelid')
          .eq('wardenid', wardenId)
          .single();

        if (hostelError) {
          console.error('Error fetching hostel:', hostelError);
          toast.error('Failed to fetch hostel details.');
          setLoading(false);
          return;
        }

        const hostelId = hostelData.hostelid;
        setWardenHostelId(hostelId);

        // 3. Fetch occupantdetails
        const { data: occupantData, error: occupantError } = await supabase
          .from('occupantdetails')
          .select('*')
          .eq('hostelid', hostelId);

        if (occupantError) {
          console.error('Error fetching occupant details:', occupantError);
          toast.error('Failed to fetch inmate details.');
          setLoading(false);
          return;
        }

        // 4. Fetch users related to occupantdetails
        const userIds = occupantData.map((occ) => occ.userid);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, email, contact')
          .in('id', userIds);

        if (userError) {
          console.error('Error fetching user details:', userError);
          toast.error('Failed to fetch user details.');
          setLoading(false);
          return;
        }

        // 5. Fetch hostelroomdetails related to occupantdetails
        const roomIds = occupantData.map((occ) => occ.roomid);
        const { data: roomData, error: roomError } = await supabase
          .from('hostelroomdetails')
          .select('roomid, rentperperson')
          .in('roomid', roomIds);

        if (roomError) {
          console.error('Error fetching room details:', roomError);
          toast.error('Failed to fetch room details.');
          setLoading(false);
          return;
        }

        // 6. Combine the data
        const combinedData = occupantData.map((occ) => {
          const user = userData.find((u) => u.id === occ.userid);
          const room = roomData.find((r) => r.roomid === occ.roomid);
          return {
            userid: occ.userid,
            hostelid: occ.hostelid,
            roomid: occ.roomid,
            name: user ? user.name : 'N/A',
            email: user ? user.email : 'N/A',
            contact: user ? user.contact : 'N/A',
            rent_per_person: room ? room.rentperperson : 'N/A',
          };
        });

        setInmates(combinedData);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Sorting function
  const sortedInmates = React.useMemo(() => {
    let sortableInmates = [...inmates];
    if (sortConfig.key) {
      sortableInmates.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInmates;
  }, [inmates, sortConfig]);

  console.log("Sorted inmates list:",sortedInmates);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Remove Inmate Handler
  const handleRemoveInmate = (inmate) => {
    setSelectedInmate(inmate);
    setIsModalOpen(true);
  };

  const confirmRemoveInmate = async () => {
    if (!selectedInmate) return;

    const { userid, roomid } = selectedInmate;

    try {
      // 1. Increment vacancies in hostelroomdetails
      const { data: roomData, error: roomError } = await supabase
        .from('hostelroomdetails')
        .select('vacancies')
        .eq('roomid', roomid)
        .single();

      if (roomError) {
        throw roomError;
      }

      const newVacancies = roomData.vacancies + 1;

      const { error: updateRoomError } = await supabase
        .from('hostelroomdetails')
        .update({ vacancies: newVacancies })
        .eq('roomid', roomid);

      if (updateRoomError) {
        throw updateRoomError;
      }

      // 2. Remove the record from occupantdetails
      const { error: deleteOccupantError } = await supabase
        .from('occupantdetails')
        .delete()
        .eq('userid', userid)
        .eq('hostelid', wardenHostelId)
        .eq('roomid', roomid);

      if (deleteOccupantError) {
        throw deleteOccupantError;
      }

      // 3. Update the users table by setting hostelid and roomid to null
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ hostelid: null, roomid: null })
        .eq('id', userid); // Ensure 'id' matches the foreign key

      if (updateUserError) {
        throw updateUserError;
      }

      // 4. Update the local state to remove the inmate from the list
      setInmates((prevInmates) => prevInmates.filter((inmate) => inmate.userid !== userid));

      toast.success('Inmate removed successfully!');
    } catch (error) {
      console.error('Error removing inmate:', error);
      toast.error('Failed to remove inmate.');
    } finally {
      setIsModalOpen(false);
      setSelectedInmate(null);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">View Inmates</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="text-xl text-gray-700">Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name
                    <FontAwesomeIcon
                      icon={
                        sortConfig.key === 'name'
                          ? sortConfig.direction === 'asc'
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                      className="ml-2"
                    />
                  </th>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={() => requestSort('roomid')}
                  >
                    Room ID
                    <FontAwesomeIcon
                      icon={
                        sortConfig.key === 'roomid'
                          ? sortConfig.direction === 'asc'
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                      className="ml-2"
                    />
                  </th>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={() => requestSort('rent_per_person')}
                  >
                    Rent/Person
                    <FontAwesomeIcon
                      icon={
                        sortConfig.key === 'rent_per_person'
                          ? sortConfig.direction === 'asc'
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                      className="ml-2"
                    />
                  </th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Contact</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedInmates.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No inmates found.
                    </td>
                  </tr>
                ) : (
                  sortedInmates.map((inmate) => (
                    <tr key={inmate.userid} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{inmate.name}</td>
                      <td className="py-2 px-4 border-b">{inmate.roomid}</td>
                      <td className="py-2 px-4 border-b">₹{inmate.rent_per_person}</td>
                      <td className="py-2 px-4 border-b">{inmate.email}</td>
                      <td className="py-2 px-4 border-b">{inmate.contact}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleRemoveInmate(inmate)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirmation Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Confirm Removal
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove <strong>{selectedInmate?.name}</strong> from the hostel?
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                        onClick={confirmRemoveInmate}
                      >
                        Remove
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}

export default ViewInmates;

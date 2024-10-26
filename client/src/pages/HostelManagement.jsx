// HostelManagement.jsx
import { useState, useEffect } from "react";
import { supabase } from "../Supabase"; // Ensure correct path
import { useNavigate, useParams, Link } from "react-router-dom";

const HostelManagement = () => {
  const { wardenID } = useParams();

  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mess_available: false,
    gender: "",
    thumbnail: "",
    occupanttype: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [thumbnail, setThumbnail] = useState("");

  // Fetch Hostel Details
  const fetchHostel = async () => {
    if (!wardenID) return;

    const { data, error } = await supabase
      .from("hostels")
      .select("*")
      .eq("wardenid", wardenID)
      .single();

    console.log("Hostel data:", data);

    if (error && error.code !== "PGRST116") {
      // PGRST116: No rows found
      console.error("Error fetching hostel:", error);
      alert("Error fetching hostel data.");
    } else if (data) {
      setHostel(data);
      setFormData({
        name: data.name,
        address: data.address,
        mess_available: data.mess_available,
        gender: data.gender,
        thumbnail: data.thumbnail,
        occupanttype: data.occupanttype,
        id: data.hostelid,
      });
      setIsEditing(true);
    }
    setLoading(false);
  };

  // Fetch Rooms for the Hostel
  const fetchRooms = async () => {
    if (!hostel) return;

    const { data, error } = await supabase
      .from("hostelroomdetails")
      .select("*")
      .eq("hostelid", hostel.hostelid);

    console.log("Rooms data:", data);

    if (error) {
      console.error("Error fetching rooms:", error);
      alert("Error fetching room data.");
    } else {
      setRooms(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (wardenID) {
      fetchHostel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wardenID]);

  useEffect(() => {
    if (hostel) {
      fetchRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostel]);

  // Function to refresh rooms after adding/editing
  const refreshRooms = () => {
    fetchRooms();
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files.length > 0) {
      setThumbnail(URL.createObjectURL(files[0])); // Create a URL for the thumbnail
      setFormData((prevData) => ({
        ...prevData,
        thumbnail: files[0], // Store the file object for upload
      }));

      console.log(formData);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { name, address, gender, occupanttype } = formData;
    if (!name || !address || !gender || !occupanttype) {
      alert("Please fill in all required fields.");
      return;
    }

    let thumbnailUrl = "";

    if (formData.thumbnail) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(`${formData.name}/${formData.thumbnail.name}`, formData.thumbnail);

      if (uploadError) {
        console.error("Error uploading thumbnail:", uploadError);
        alert("Failed to upload thumbnail: " + uploadError.message);
        return;
      } else {
        console.log("Thumbnail uploaded successfully:", uploadData);
      }

      // Get the public URL for the uploaded image
      thumbnailUrl = supabase.storage
        .from("thumbnails")
        .getPublicUrl(uploadData.path).publicURL;

        console.log(thumbnailUrl)

      setThumbnail(thumbnailUrl)
    }

    if (isEditing) {
      // Update existing hostel details
      const { data, error } = await supabase
        .from("hostels")
        .update({
          name: formData.name,
          address: formData.address,
          mess_available: formData.mess_available,
          gender: formData.gender,
          thumbnail: formData.thumbnail.name,
          occupanttype: formData.occupanttype,
        })
        .eq("wardenid", wardenID);

      if (error) {
        console.error("Error updating hostel:", error);
        alert("Failed to update hostel: " + error.message);
      } else {
        console.log("Hostel updated:", data);
        alert("Hostel updated successfully!");
        navigate("/wardenHome"); // Redirect to warden dashboard or home
      }
    } else {
      // Create a new hostel
      const { data, error } = await supabase.from("hostels").insert([
        {
          name: formData.name,
          address: formData.address,
          mess_available: formData.mess_available,
          gender: formData.gender,
          thumbnail: formData.thumbnail.name,
          max_occupants: 10,
          occupanttype: formData.occupanttype,
          wardenid: wardenID,
        },
      ]);

      if (error) {
        console.error("Error creating hostel:", error);
        alert("Failed to create hostel: " + error.message);
      } else {
        console.log("Hostel created:", data);
        alert("Hostel created successfully!");
        navigate("/wardenHome"); // Redirect to warden dashboard or home
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center bg-surface text-white p-4 space-y-4 md:space-y-0 md:space-x-4">
      {/* Hostel Details Section */}
      <div className="bg-mixed p-8 rounded-lg shadow-lg w-full md:w-1/2">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEditing ? "Edit Hostel Details" : "Create New Hostel"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium "
            >
              Hostel Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-[#444948] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium "
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="mt-1 block w-full bg-[#444948] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <label
              htmlFor="mess_available"
              className="ml-2 block text-sm "
            >
              Mess Available
            </label>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium "
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-[#444948] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Co-ed">Co-ed</option>
            </select>
          </div>

          {/* Occupant Type */}
          <div className="mb-4">
            <label
              htmlFor="occupanttype"
              className="block text-sm font-medium "
            >
              Occupant Type
            </label>
            <select
              id="occupanttype"
              name="occupanttype"
              value={formData.occupanttype}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-[#444948] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Occupant Type</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Upload Thumbnail */}
          <div className="mb-4">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium "
            >
              Thumbnail
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*" // This restricts the file input to image files
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-[#444948] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              {isEditing ? "Update Hostel" : "Create Hostel"}
            </button>
          </div>
        </form>
      </div>

      {/* Room Management Section */}
      <div className="bg-mixed p-8 rounded-lg shadow-lg w-full md:w-1/2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Room Management</h2>
          {isEditing && hostel && (
            <Link
              to={`/addRoom/${hostel.hostelid}`}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Add Room
            </Link>
          )}
        </div>

        {/* Rooms List */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#2d322c]">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">S.No.</th>
                <th className="py-2 px-4 border-b">Max Occupants</th>
                <th className="py-2 px-4 border-b">Vacancies</th>
                <th className="py-2 px-4 border-b">Rent/Person</th>
                <th className="py-2 px-4 border-b">Rent Due Date</th>
                <th className="py-2 px-4 border-b">Attached Bathroom</th>
                <th className="py-2 px-4 border-b">Furniture Available</th>
                <th className="py-2 px-4 border-b">AC Available</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-4 text-center text-gray-500">
                    No rooms added yet.
                  </td>
                </tr>
              ) : (
                rooms.map((room,index) => (
                  <tr key={room.roomid}>
                    <td className="py-2 px-4 border-b text-center font-serif text-xl">
                      {index+1}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {room.maxoccupants}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {room.vacancies}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      ₹{room.rentperperson}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {new Date(room.rentduedate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {room.attachedbathroom ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {room.furnitureavailable ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {room.acavailable ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <Link
                        to={`/editRoom/${room.roomid}`}
                        className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostelManagement;

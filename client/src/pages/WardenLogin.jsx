// WardenLogin.jsx
import { useState } from 'react';
import { supabase } from '../Supabase'; // Ensure correct path
import { useNavigate } from 'react-router-dom';

const WardenLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    profession: '',
    age: '',
    password: '',
  });

  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, contact, address, gender, profession, age, password } = formData;

    if (isLogin) {
        // Handle login logic here
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Error logging in:', error);
            alert('Error logging in: Incorrect credentials or other error.');
        } else {
            console.log('Logged in successfully');
            alert('Logged in successfully!');
            navigate("/wardenHome");
        }
    } else {
        // Sign up warden with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    contact,
                    address,
                    gender,
                    profession,
                    age,
                },
            },
        });

        if (error) {
            console.error('Error signing up:', error);
            alert('Error signing up: ' + error.message);
            return;
        } else {
            const user = data.user;
            if (user) {
                // Store warden data in 'wardens' table
                const { data: insertData, error: insertError } = await supabase
                    .from('wardens')
                    .insert([{
                        wardenid: user.id, // Use the user ID for the wardenID
                        name,
                        email,
                        contact,
                        address,
                        gender,
                        profession,
                        age,
                    }]);

                if (insertError) {
                    console.error('Error inserting warden data:', insertError);
                    alert('Error inserting warden data: ' + insertError.message);
                    return;
                } else {
                    console.log('Warden data inserted:', insertData);
                    alert('Warden created successfully!');
                    navigate("/wardenHome");
                }
            } else {
                alert('Warden registration successful, but no user data returned.');
            }
        }
    }
};


  const toggleLoginSignUp = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <span className="text-blue-500 text-3xl">🏛️</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">
          {isLogin ? 'Warden Login' : 'Warden Sign-Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Contact Number Field */}
              <div className="mb-4">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Address Field */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              {/* Gender Field */}
              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Profession Field */}
              <div className="mb-4">
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  required
                  value={formData.profession}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Age Field */}
              <div className="mb-4">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Email Address Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{isLogin ? 'Password' : 'Create Password'}</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>

          {/* Toggle Login/Sign-Up */}
          <p className="mt-4 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleLoginSignUp}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default WardenLogin;
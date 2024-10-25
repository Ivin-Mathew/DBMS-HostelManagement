import { useState } from 'react';
import { supabase } from '../Supabase';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    profession: '',
    age: '', // Ensure 'age' is included correctly
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
        // alert('Logged in successfully!');
        navigate("/userHome");
      }
    } else {
      // Sign up user with Supabase
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
            age, // Ensure 'age' is correctly passed
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
          // Store user data in 'users' table
          const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert([{ id: user.id, name, email, contact, address, gender, profession, age }]); // Correct 'age' field

          if (insertError) {
            console.error('Error inserting user data:', insertError);
            alert('Error inserting user data: ' + insertError.message);
          } else {
            console.log('User data inserted:', insertData);
            alert('User created successfully!');
            navigate("/userHome");
          }
        } else {
          alert('User registration successful, but no user data returned.');
        }
      }
    }
  };

  const toggleLoginSignUp = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center bg-surface">
      <div className="bg-mixed text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <span className="text-blue-500 text-3xl">🏛️</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">
          {isLogin ? 'User Login' : 'User Sign-Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-primary font-[700] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Contact Number Field */}
              <div className="mb-4">
                <label htmlFor="contact" className="block text-sm font-medium ">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-primary font-[700]  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Address Field */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium ">Address</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-primary font-[700]  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              {/* Gender Field */}
              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium ">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-primary font-[700]  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option> {/* Capitalized for consistency */}
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Profession Field */}
              <div className="mb-4">
                <label htmlFor="profession" className="block text-sm font-medium ">Profession</label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  required
                  value={formData.profession}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-primary font-[700] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Age Field */}
              <div className="mb-4">
                <label htmlFor="age" className="block text-sm font-medium ">Age</label>
                <input
                  type="number" // Changed type to 'number'
                  id="age" // Changed id to 'age'
                  name="age" // Changed name to 'age'
                  required
                  value={formData.age}
                  onChange={handleChange}
                  min="1" // Optional: Set minimum age
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm  text-primary font-[700] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Email Address Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium ">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white text-primary font-[700] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium ">
              {isLogin ? 'Password' : 'Create Password'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-primary font-[700] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>

          {/* Toggle Login/Sign-Up */}
          <p className="mt-4 text-center ">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleLoginSignUp}
              className="text-blue-500"
            >
              {isLogin ? 'Sign Up' : 'Log in'}
            </button>
          </p>

          <div className=' flex flex-row items-center justify-center 
          p-3 mt-4
          bg-[#413f53] rounded-lg'>
            Are you a warden?
            <p className='ml-1 text-blue-500 hover:cursor-pointer' onClick={()=> navigate("/wardenLogin")}>
              Login Here!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;

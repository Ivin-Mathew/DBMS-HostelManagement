import { useState } from 'react';
import { supabase } from '../Supabase';
import {useNavigate} from 'react-router-dom';

const UserLogin = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    password: '',
  });

  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, contact, address, gender, password } = formData;

    if (isLogin) {
      // Handle login logic here
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error logging in:', error);
      } else {
        console.log('Logged in successfully');
        navigate("/userHome");
      }
    } else {
      // Sign up user with Supabase
      const { user, error } = await supabase.auth.signUp({email,password,});

      if (error) {
        console.error('Error signing up:', error);
        return;
      }
      else{
        // Store warden data in 'wardens' table
        const { data, error: insertError } = await supabase
          .from('users')
          .insert([{ id: user.id, name, email, contact, address, gender }]);

        if (insertError) {
          console.error('Error inserting user data:', insertError);
        } else {
          console.log('User data inserted:', data);
          navigate("/userHome");
        }
      }    
    }
  };

  const toggleLoginLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <span className="text-blue-500 text-3xl">🏛️</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">
          {isLogin ? 'User Login' : 'User Sign-Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>

          <p className="mt-4 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleLoginLogin}
              className="text-blue-500"
            >
              {isLogin ? 'Sign Up' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
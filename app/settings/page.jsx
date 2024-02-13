'use client';
import React from 'react';
import {useState} from 'react'

import Form from '@components/Form';

const SettingsPage = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // State to hold password data

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State to control the visibility of the update password form
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);


  // Dummy function for handling subscription changes
  const handleChangeSubscription = () => {
    // Logic to handle subscription change
    console.log('Change subscription clicked');
    // This could redirect to a page or modal where users can select a new plan
  };

  // Dummy function for handling subscription cancellation
  const handleCancelSubscription = () => {
    // Logic to handle subscription cancellation
    console.log('Cancel subscription clicked');
    // This should ideally trigger a confirmation prompt before proceeding
  };

    // Handle form input changes
    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      // Logic to handle form submission
      console.log('Form data:', formData);
      // You might want to send this data to a server or email service
    };

      // Handle password form input changes
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Handle password update form submission
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    // Add logic to update password
    console.log('Password update data:', passwordData);
    // Ensure to validate the new password and confirm password match
  };

  // Function to toggle the visibility
  const togglePasswordForm = () => {
    setIsPasswordFormVisible(!isPasswordFormVisible);
  };
  

  return (
    <div className="mt-36 mx-auto w-4/5">

      <Form />
      {/* First Row: */}
      {/* <div className='w-full border-2 border-black flex flex-col p-4'>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">Update Password</h2>
          <button 
            onClick={togglePasswordForm} 
            className={`${isPasswordFormVisible ? 'bg-transparent hover:bg-blue-100 text-blue-700' : 'bg-blue-500 hover:bg-blue-700 text-white'} font-bold py-2 px-4 rounded border border-blue-500 hover:border-blue-700`}
          >
            {isPasswordFormVisible ? 'Hide Form' : 'Change Password'}
          </button>
        </div>

        {isPasswordFormVisible && (
          <form onSubmit={handlePasswordUpdate} className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                Current Password
              </label>
              <input 
                type="password" 
                id="currentPassword" 
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input 
                type="password" 
                id="newPassword" 
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="flex items-center justify-end">
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
        </div>     */}

{/* Second Row: */}
  {/* <div className='mt-10 w-full border-2 border-black'>
      <div className="w-full flex justify-between items-center p-4">
        <div>
          <h2 className="text-xl font-semibold">Manage Subscription</h2>
          <p>Your current plan: <strong>Pro</strong></p>
        </div>
        <button 
          onClick={handleChangeSubscription} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Change Subscription
        </button>
      </div>
    </div> */}

        {/* Contact Us / Leave Feedback Form */}
      {/* <div className='mt-10 w-full h-auto border-2 border-black'>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Contact || Leave Feedback || Feature Recommendations</h2> */}
          {/* <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              ></textarea>
            </div>
            <div className="flex items-center justify-end">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="submit"
            >
              Send
            </button>
          </div>
          </form> */}
        </div>
      // </div>
      // </div>
  );
};

export default SettingsPage;

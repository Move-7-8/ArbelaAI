'use client';
import React from 'react';
import {useState} from 'react'

import Form from '@components/Form';

const SettingsPage = () => {
  // State to hold form data
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   message: ''
  // });

  // State to hold password data

  // const [passwordData, setPasswordData] = useState({
  //   currentPassword: '',
  //   newPassword: '',
  //   confirmPassword: ''
  // });

  // // State to control the visibility of the update password form
  // const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);


  // // Dummy function for handling subscription changes
  // const handleChangeSubscription = () => {
  //   // Logic to handle subscription change
  //   console.log('Change subscription clicked');
  //   // This could redirect to a page or modal where users can select a new plan
  // };

  // // Dummy function for handling subscription cancellation
  // const handleCancelSubscription = () => {
  //   // Logic to handle subscription cancellation
  //   console.log('Cancel subscription clicked');
  //   // This should ideally trigger a confirmation prompt before proceeding
  // };

  //   // Handle form input changes
  //   const handleInputChange = (e) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   };
  
  //   // Handle form submission
  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // Logic to handle form submission
  //     console.log('Form data:', formData);
  //     // You might want to send this data to a server or email service
  //   };

  //     // Handle password form input changes
  // const handlePasswordChange = (e) => {
  //   setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  // };

  // // Handle password update form submission
  // const handlePasswordUpdate = (e) => {
  //   e.preventDefault();
  //   // Add logic to update password
  //   console.log('Password update data:', passwordData);
  //   // Ensure to validate the new password and confirm password match
  // };

  // // Function to toggle the visibility
  // const togglePasswordForm = () => {
  //   setIsPasswordFormVisible(!isPasswordFormVisible);
  // };
  

  return (
    <div className="mt-36 mx-auto w-4/5">
      <Form />
    </div>
  );
};

export default SettingsPage;

'use client';
import React from 'react';
import {useState} from 'react'

import Form from '@components/Form';
import SettingsFeatures from '@components/SettingsFeatures';

const SettingsPage = () => {
 

  return (
    <div className="mt-36 mx-auto w-4/5">
      <SettingsFeatures />
      <Form />
    </div>
  );
};

export default SettingsPage;

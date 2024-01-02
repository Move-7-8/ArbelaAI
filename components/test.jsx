import React, { useState } from 'react';

const Test = () => {
  const [result, setResult] = useState(''); // State to store the result

  const handleClick = async () => {
    try {
      console.log('bout to hit')

      const response = await fetch('/api/cron', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      // setResult(JSON.stringify(data, null, 2)); // Update result state with formatted data
    } catch (error) {
      console.error('There was an error!', error);
      setResult(`Error: ${error.message}`); // Update result state with error message
    }
  };

  return (
    <div style={{ padding: '20px' }}> {/* Add padding around the component */}
      {/* Button with added styles */}
      <button className='testButton border p-4 bg-white font-extrabold' onClick={handleClick}>Test</button>
      {/* Container to display the result */}
      <div className='resultContainer' style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
        {result}
      </div>
    </div>
  );
};

export default Test;

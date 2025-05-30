import { useState } from 'react';

const CronTest = () => {
  const [result, setResult] = useState(''); // State to store the result

  const handleClick = async () => {
    try {
      const response = await fetch('/api/cron959', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'triggerKeyword': 'triggernow' }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      // setResult(JSON.stringify(data, null, 2)); // Update result state with formatted data
    } catch (error) {
      console.error('There was an error!', error);
      setResult(`Error: ${error.message}`); // Update result state with error message
    }
  };

  const handleClick2 = async () => {
    try {
      const response = await fetch('/api/cron2959', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'triggerKeyword': 'triggernow' }),
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
    <>
    <div style={{ padding: '20px' }}> {/* Add padding around the component */}
      {/* Button with added styles */}
      <button className='testButton border p-4 bg-white font-extrabold' onClick={handleClick}>CronTest</button>
      {/* Container to display the result */}
      <div className='resultContainer' style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
        {result}
      </div>
    </div>
    <div style={{ padding: '20px' }}> {/* Add padding around the component */}
      {/* Button with added styles */}
      <button className='testButton border p-4 bg-white font-extrabold' onClick={handleClick2}>CronTest 2</button>
      {/* Container to display the result */}
      <div className='resultContainer' style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
      </div>
    </div>

    </>
  );
};

export default CronTest;

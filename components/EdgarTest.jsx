import React from 'react'

const EdgarTest = () => {

    const ticker = 'A'

    const handleClick = async () => {
        try {

          const response = await fetch('/api/EDGAR', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'ticker': ticker }),

          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
    
          const data = await response.json();
          console.log(data)
          url = data.documentUrl
        } catch (error) {
          console.error('There was an error!', error);
        }
      };
    

  return (
    <div style={{ padding: '20px' }}> 
      <button className='testButton border p-4 bg-white font-extrabold' onClick={handleClick}>EDGARTest</button>
      <div className='resultContainer' style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
      </div>
    </div>
  )
}

export default EdgarTest
import React from 'react'
import Lottie from 'react-lottie';
import animationData from '../../public/assets/images/loading4.json'; // Path to your Lottie file

const ChatLoad = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice' // Adjust as needed
    },
  };

  return (
<div className="flex flex-col items-center justify-center" style={{ marginTop: '300px' }}> {/* Custom margin top */}
  <div> {/* Increased margin to the top */}
        {/* Lottie Animation Wrapper with Increased Opacity */}
             <div style={{ 
            opacity: 1, // Fully opaque
            borderRadius: '10px' // Optional: to round the corners of the background
          }}>
          <Lottie options={defaultOptions} height={150} width={150} /> {/* Adjust the size if needed */}
        </div>
      </div>
    </div>
  )
}

export default ChatLoad;


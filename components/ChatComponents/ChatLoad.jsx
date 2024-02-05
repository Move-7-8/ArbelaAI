import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../public/assets/images/loading4.json';

const ChatLoad = () => {
    // Helper function to determine initial container height
    const calculateInitialHeight = () => window.innerWidth >= 1024 ? '84vh' : '60vh';
     const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Initial check

    // Set initial container height based on current viewport width
    const [containerHeight, setContainerHeight] = useState(calculateInitialHeight());

    useEffect(() => {
        const handleResize = () => {
            // Adjust container height based on viewport width
            const height = calculateInitialHeight();
            setContainerHeight(height);
        };

        // Set height on mount and add resize event listener
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        },
    };

    return (
        <div className={`bg-gray-100 mb-2 bg-opacity-50 m-4 rounded-lg shadow-lg overflow-hidden flex items-center justify-center ${isLargeScreen ? 'fixed bottom-20 w-full top-20 lg:max-w-[calc(25%-2.3rem)]' : ''}`} 
             style={{ height: containerHeight, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{
                opacity: 1,
                borderRadius: '10px',
                height: '150px',
                width: '150px'
            }}>
                <Lottie options={defaultOptions} height={150} width={150} />
            </div>
        </div>
    );
};

export default ChatLoad;


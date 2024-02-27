import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../public/assets/images/loading.json';

const ChatLoad = () => {
    const calculateInitialHeight = () => window.innerWidth >= 1024 ? '87vh' : '60vh';
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Initial check
    const [containerHeight, setContainerHeight] = useState(calculateInitialHeight());
    const [showTypingText, setShowTypingText] = useState(false); // State to control typing text visibility
    const [showTrainingText, setShowTrainingText] = useState(false); // For "training model..." text
    const [showGatheringDataText, setShowGatheringDataText] = useState(false); // For "gathering data..." text

    useEffect(() => {
        const handleResize = () => {
            // Adjust container height based on viewport width
            const height = calculateInitialHeight();
            setContainerHeight(height);
        };

        // Set height on mount and add resize event listener
        handleResize();
        window.addEventListener('resize', handleResize);

        //Showing the typing text...
        const gatheringDataTimer = setTimeout(() => setShowGatheringDataText(true), 4000);
        const removeGatheringDataTimer = setTimeout(() => setShowGatheringDataText(false), 7000);
        const trainingTimer = setTimeout(() => setShowTrainingText(true), 7000);
        const removeTrainingTimer = setTimeout(() => setShowTrainingText(false), 10000);
        
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(gatheringDataTimer);
            clearTimeout(removeGatheringDataTimer);
            clearTimeout(trainingTimer);
            clearTimeout(removeTrainingTimer);
        };
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
        <div className={`bg-gray-100 mb-2 bg-opacity-50 m-4 rounded-lg shadow-lg overflow-hidden flex flex-col items-center justify-center ${isLargeScreen ? 'fixed bottom-20 w-full top-16 lg:max-w-[calc(25%-2.3rem)]' : ''}`}
             style={{ height: containerHeight, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{
                opacity: 1,
                borderRadius: '10px',
                height: '150px',
                width: '150px'
            }}>
                <Lottie options={defaultOptions} height={150} width={150} />
            </div>
            {showGatheringDataText && <div className="typing-text" style={{marginTop: '20px', textAlign: 'center'}}>Gathering data...</div>}
            {showTrainingText && <div className="typing-text" style={{marginTop: '10px', textAlign: 'center'}}>Training model...</div>}
        </div>
    );
};

export default ChatLoad;


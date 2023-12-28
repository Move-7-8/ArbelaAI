import React from 'react';

const Card = ({ color, title }) => {
    let gradient;
    switch (color) {
        case 'green':
            gradient = 'linear-gradient(75deg, rgba(195, 223, 198, 0.5), rgba(221, 236, 221, 0.5))';
            break;
        case 'blue':
            gradient = 'linear-gradient(75deg, rgba(150, 167, 208, 0.5), rgba(223, 235, 231, 0.5))';
            break;
        case 'yellow':
            gradient = 'linear-gradient(75deg, rgba(219, 246, 231, 0.5), rgba(251, 221, 151, 0.5))';
            break;
        case 'red':
            gradient = 'linear-gradient(75deg, rgba(224, 210, 197, 0.5), rgba(248, 244, 244, 0.5))';
            break;
        default:
            gradient = 'linear-gradient(75deg, rgba(128, 128, 128, 0.5), rgba(64, 64, 64, 0.5))';
    }

    return (
        <div className="card text-white p-4 m-4 flex-grow rounded-md"
             style={{
                 minWidth: '150px',
                 minHeight: '110px',
                 position: 'relative',
                 overflow: 'hidden' // Ensures the blur doesn't bleed outside the card
             }}>
            <div className="card-background" style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: gradient,
                filter: 'blur(10px)', // Apply Gaussian blur to background
                zIndex: -1
            }}></div>
            <h3 style={{ position: 'relative', zIndex: 1 }}>{title}</h3>
        </div>
    );
}





export default Card;



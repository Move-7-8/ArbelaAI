import React from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';

const InvestorImagesMarquee = () => {
    // Array of image names
    const imageNames = ['betterlabs.png', 'capricorn.png', 'eastcourt.png', 'hawaiian.png', 'spacecubed.png', 'vici.png', 'Woodside.png'];

    return (
        <Marquee gradient={false} speed={50}>
            <div style={{ display: 'flex', alignItems: 'center' }}> {/* Ensure items are centered */}
                {imageNames.map((name, index) => (
                    <div key={index} style={{ marginRight: '20px', width: 100, height: 100, position: 'relative' }}> {/* Updated styles */}
                        <Image
                            src={`/assets/images/investors/${name}`}
                            alt={`Investor ${name}`}
                            layout="fill" // Make image fill the container
                            objectFit="contain" // Ensure that images are resized correctly
                        />
                    </div>
                ))}
                {imageNames.map((name, index) => ( // Duplicate the images for a seamless loop
                    <div key={index + imageNames.length} style={{ marginRight: '20px', width: 100, height: 100, position: 'relative' }}> {/* Updated styles */}
                        <Image
                            src={`/assets/images/investors/${name}`}
                            alt={`Investor ${name}`}
                            layout="fill" // Make image fill the container
                            objectFit="contain" // Ensure that images are resized correctly
                        />
                    </div>
                ))}
            </div>
        </Marquee>
    );
};

export default InvestorImagesMarquee;

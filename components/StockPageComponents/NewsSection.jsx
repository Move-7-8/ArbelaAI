import React, { useState } from 'react';

const NewsSection = ({ data2 }) => {
    const [visibleCount, setVisibleCount] = useState(4);

    // Function to render skeleton loader for news cards
    const renderSkeletonCards = () => {
        return [...Array(visibleCount)].map((_, index) => (
            <div key={index} className="block rounded-lg overflow-hidden shadow-lg relative min-h-[200px] bg-gray-200 animate-pulse"></div>
        ));
    };

    const newsArray2 = data2?.['get-news']?.data?.main?.stream || []; // Assuming this structure or adjust based on actual API response

    // Adjusted Function to choose an appropriate thumbnail resolution
    // Now it correctly accepts an item to get its thumbnail URL
    const getThumbnailUrl = (item) => {
        return item?.content?.thumbnail?.resolutions?.[0]?.url || ''; // Using the first thumbnail resolution URL
    };

    console.log(data2)


    const titleCase = (str) => {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getTimeAgo = (publishTime) => {
        const now = new Date();
        const publishedDate = new Date(publishTime);
        const differenceInMinutes = Math.floor((now - publishedDate) / 60000);

        if (differenceInMinutes < 60) {
            return `${differenceInMinutes} minute${differenceInMinutes === 1 ? '' : 's'} ago`;
        } else if (differenceInMinutes < 1440) {
            const hours = Math.floor(differenceInMinutes / 60);
            return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        } else {
            const days = Math.floor(differenceInMinutes / 1440);
            return `${days} day${days === 1 ? '' : 's'} ago`;
        }
    };


    return (
        <div>
            <h2 className="text-lg font-semibold mb-4 uppercase mt-8 text-gray-500">Company News</h2>
            <div className="grid md:grid-cols-2 gap-4">
            {newsArray2.length === 0 ? renderSkeletonCards() : newsArray2.slice(0, visibleCount).map((item, index) => (
                <a key={index} href={item.content?.clickThroughUrl?.url} target="_blank" rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden shadow-lg relative min-h-[200px] group">
                    <div className="absolute inset-0 bg-cover bg-center filter blur-sm group-hover:blur-none transition duration-300 ease-in-out"
                        style={{
                            backgroundImage: `url(${getThumbnailUrl(item)})`,
                            backgroundColor: '#333', // Fallback dark grey background if no image
                        }}>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 rounded-t-lg" style={{ height: '53%' }}>
                        <div className="p-4 flex flex-col justify-between h-full">
                            {/* Article Title with Tooltip Trigger */}
                            <div className="relative group">
                            <h3 className="text-black text-sm font-semibold overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>
                                {titleCase(item.content?.title)}
                            </h3>
                            {/* Tooltip Content */}
                            <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 border border-3A3C3E bg-white text-black text-xs rounded-md">
                                {titleCase(item.content?.title)}
                            </span>
                            </div>
                            <div className="text-black text-xs mt-1">
                                <p>By {item.content?.provider?.displayName}</p>
                                <p>Updated {getTimeAgo(item?.content?.pubDate)}</p>
                            </div>
                        </div>
                    </div>
                </a>
            ))}
            </div>



            <div className="flex justify-center mt-4 mb-4">
                {visibleCount < newsArray2.length && (
                    <button onClick={loadMore} className="w-24 uppercase text-sm rounded-full py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 mb-4 ml-4 mr-4 border border-[#FF6665] text-[#FF6665]">
                        See More
                    </button>
                )}
            </div>
        </div>
    );
};

export default NewsSection;

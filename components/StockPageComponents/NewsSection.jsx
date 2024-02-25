import React, { useState, useEffect } from 'react';

const NewsSection = ({ data2 }) => {
    const [visibleCount, setVisibleCount] = useState(4);
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state to true

    // Function to simulate data loading and adjust isLoading state
    useEffect(() => {
        if (data2) {
            setIsLoading(false); // Set loading to false when data2 is loaded
        }
    }, [data2]); // Dependency array includes data2 to re-run effect when it changes

    // Function to render skeleton loader for news cards
    const renderSkeletonCards = () => {
        return [...Array(visibleCount)].map((_, index) => (
            <div key={index} className="block rounded-lg overflow-hidden shadow-lg relative min-h-[200px] bg-gray-200 animate-pulse"></div>
        ));
    };

    const newsArray2 = data2?.['get-news']?.data?.main?.stream || []; // Adjust based on actual API response structure

    // Adjusted Function to choose an appropriate thumbnail resolution
    const getThumbnailUrl = (item) => {
        return item?.content?.thumbnail?.resolutions?.[0]?.url || ''; // Using the first thumbnail resolution URL
    };

    const titleCase = (str) => {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getTimeAgo = (publishTime) => {
        const now = new Date();
        const publishedDate = new Date(publishTime);
        const differenceInMinutes = Math.floor((now - publishedDate) / 60000);

        return differenceInMinutes < 60 ? `${differenceInMinutes} minute${differenceInMinutes === 1 ? '' : 's'} ago` :
               differenceInMinutes < 1440 ? `${Math.floor(differenceInMinutes / 60)} hour${Math.floor(differenceInMinutes / 60) === 1 ? '' : 's'} ago` :
               `${Math.floor(differenceInMinutes / 1440)} day${Math.floor(differenceInMinutes / 1440) === 1 ? '' : 's'} ago`;
    };

    // Placeholder for loadMore function
    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 4); // Example increment, adjust as needed
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4 uppercase mt-8 text-gray-500">Company News</h2>
            <div className="grid md:grid-cols-2 mb-4 gap-4">
                {newsArray2.length === 0 ? (
                    isLoading ? renderSkeletonCards() : <div className="text-center text-gray-700">No news for this company.</div>
                ) : (
                    newsArray2.slice(0, visibleCount).map((item, index) => (
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
                                    <div className="relative group">
                                        <h3 className="text-black text-sm font-semibold overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>
                                            {titleCase(item.content?.title)}
                                        </h3>
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
                    ))
                )}
            </div>

            {visibleCount < newsArray2.length && (
                <div className="flex justify-center mt-4 mb-4">
                    <button onClick={loadMore} className="uppercase text-sm rounded-full py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 mb-4 ml-4 mr-4 border border-[#FF6665] text-[#FF6665]">
                        See More
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewsSection;

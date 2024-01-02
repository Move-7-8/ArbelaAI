import React, { useState } from 'react';

const NewsSection = ({ data }) => {
    const [visibleCount, setVisibleCount] = useState(4);

    // Check if data is null or undefined
    const newsArray = data && data.news ? Object.values(data.news) : [];

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 5); // Load 5 more articles
    };

    const getThumbnailUrl = (article) => {
    // Assuming the thumbnail URL is in the first element of the resolutions array
    return article.thumbnail?.resolutions[0]?.url || ''; // Provide a fallback URL or an empty string
};

    const titleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getTimeAgo = (publishTime) => {
        const now = new Date();
        const publishedDate = new Date(publishTime * 1000);
        const differenceInMinutes = Math.floor((now - publishedDate) / 60000);

        if (differenceInMinutes < 60) return `${differenceInMinutes} minutes ago`;
        else if (differenceInMinutes < 1440) return `${Math.floor(differenceInMinutes / 60)} hour(s) ago`;
        else return `${Math.floor(differenceInMinutes / 1440)} day(s) ago`;
    };



 return (
<div>
            <h2 className="text-2xl font-semibold mb-4 mt-8">Company News</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {newsArray.slice(0, visibleCount).map((article, index) => (
                    <a key={index} href={article.link} target="_blank" rel="noopener noreferrer"
                       className="block rounded-lg overflow-hidden shadow-lg relative min-h-[220px] group">
                        <div className="absolute inset-0 bg-cover bg-center filter blur-sm group-hover:blur-none transition duration-300 ease-in-out"
                             style={{ backgroundImage: `url(${getThumbnailUrl(article)})` }}>
                             {/* Blurred background */}
                        </div>
                        <div className="absolute top-0 left-0 right-0 p-4">
                            <h3 className="text-white text-md font-semibold" style={{ textShadow: '3px 3px 4px rgba(0,0,0,0.8)' }}>{titleCase(article.title)}</h3>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="text-sm text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                <p>By {article.publisher}</p>
                                <p>Updated {getTimeAgo(article.providerPublishTime)}</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            {visibleCount < newsArray.length && (
                <button onClick={loadMore} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">See More</button>
            )}
        </div>
    );
};


export default NewsSection;

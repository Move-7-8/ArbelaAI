import React, { useState } from 'react';

const NewsSection = ({ data }) => {
    const [visibleCount, setVisibleCount] = useState(4);

        // Function to render skeleton loader for news cards
    const renderSkeletonCards = () => {
        return [...Array(visibleCount)].map((_, index) => (
            <div key={index} className="block rounded-lg overflow-hidden shadow-lg relative min-h-[200px] bg-gray-200 animate-pulse">
                {/* Additional elements to mimic the layout of the news card */}
            </div>
        ));
    };

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
        if (!str) return ''; // Return an empty string if str is undefined or null
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
  <h2 className="text-lg font-semibold mb-4 uppercase mt-8 text-gray-500">Company News</h2>

    <div className="grid md:grid-cols-2 gap-4">
      {!newsArray || newsArray.length === 0
        ? renderSkeletonCards()
         : newsArray.slice(0, visibleCount).map((article, index) => (
        <a key={index} href={article.link} target="_blank" rel="noopener noreferrer"
           className="block rounded-lg overflow-hidden shadow-lg relative min-h-[200px] group">
          <div className="absolute inset-0 bg-cover bg-center filter blur-sm group-hover:blur-none transition duration-300 ease-in-out"
               style={{
                 backgroundImage: getThumbnailUrl(article) ? `url(${getThumbnailUrl(article)})` : 'none',
                 backgroundColor: getThumbnailUrl(article) ? 'transparent' : '#333', // Dark grey background if no image
               }}>
                {/* Blurred background */}
              </div>
              {/* Adjusted container for text */}
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 rounded-t-lg" style={{ height: '53%' }}>
                <div className="p-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <h3 className="text-black text-sm font-semibold overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>
                    {titleCase(article.title)}
                  </h3>
                  <div className="text-black text-xs mt-1">
                    <p>By {article.publisher}</p>
                    <p>Updated {getTimeAgo(article.providerPublishTime)}</p>
                  </div>
                </div>
              </div>
            </a>
          ))
      }
    </div>
    <div className="flex justify-center mt-4 mb-4">
      {visibleCount < newsArray.length && (
        <button onClick={loadMore} className="w-24 px-3 py-1 rounded-lg shadow hover:scale-105 transition-transform duration-300 bg-gray-200">
          See More
        </button>
      )}
    </div>
  </div>
);





};


export default NewsSection;

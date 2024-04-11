import React from 'react';

const Profile = ({ data }) => {
  const datatest = data.threads;

  // Function to extract query parameters from URL
  const extractQueryParams = (url) => {
    const queryParams = new URL(url).search;
    return queryParams;
  }

  // Function to create a new URL with appended query parameters
  function createNewUrl(originalUrl, threadId) {
    const baseUrl = originalUrl.split('/model')[0];
    const queryParams = extractQueryParams(originalUrl);
    return `${baseUrl}/model/${threadId}${queryParams}`;
  }

  // Updated function to handle the click event
  const handleGoClick = (thread) => {
    const url = createNewUrl(thread.url, thread.threadId);
    window.location.href = url; // Redirect to the new URL
  };

  // Function to truncate string to 20 characters
  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  const shouldDisplayDate = (dateString) => {
    const formattedDate = formatDateWithDay(dateString);
    if (displayedDates.has(formattedDate)) {
      // Date already displayed
      return false;
    } else {
      // Add date to displayed dates and return true
      setDisplayedDates(new Set([...displayedDates, formattedDate]));
      return true;
    }
  };

  // Check if datatest is not undefined before creating a set of unique companies
  const uniqueCompanies = datatest ? new Set(datatest.map(thread => thread.company)) : new Set();
  
  // Local variable to keep track of displayed dates for this render
  let displayedDates = new Set();

  return (
    <section className='w-full mt-20'>
      <div className='mb-2 mt-12 text-center'>
        <h1 className='mb-10 text-7xl font-black text-black'>Your Models</h1>
      </div>
      <div className='mt-20 flex flex-col items-center'>
        {datatest && Array.from(uniqueCompanies).map((company) => {
          const thread = datatest.find(thread => thread.company === company);

          // Determine if the date should be displayed
          const formattedDate = formatDateWithDay(thread.createdDate);
          const shouldDisplayDate = !displayedDates.has(formattedDate);
          if (shouldDisplayDate) {
            displayedDates.add(formattedDate);
          }

          return thread && (
            <div className="flex flex-row w-full max-w-2xl mx-auto mb-5 items-center">
              {/* Fixed-width date area */}
              <div className="w-48 mr-4 hidden md:inline">
                {shouldDisplayDate && (
                  <span className="text-lg font-bold text-gray-600">
                    {formattedDate}
                  </span>
                )}
              </div>

        {/* Card */}
        <div 
          key={thread._id}
          className="flex-grow cursor-pointer transform transition-transform duration-200 hover:scale-105 bg-white/30 border border-gray-200 rounded-lg shadow flex flex-row justify-between items-center p-5"
        >
          <h5 className="text-md font-semibold tracking-tight text-gray-900">
            {truncateString(company, 25)}
          </h5>
          <button 
            onClick={() => handleGoClick(thread)}
            className='bg-blue-500 hover:bg-blue-700 text-white text-md font-semibold py-2 px-4 rounded'
          >
            Go to Model!!!!
          </button>
        </div>
      </div>
          );
        })}
      </div>
    </section>
  );
};

export default Profile;


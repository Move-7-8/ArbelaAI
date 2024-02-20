import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import NavStockCard from '@components/NavStockcard';

const CompanySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const navStockCardRef = useRef(null); // Ref for the NavStockCard


  const searchRef = useRef(null);

useEffect(() => {
  const handleResize = () => {
    // Check if the window width is desktop size
    if (window.innerWidth >= 768) {
      // Show search input when in desktop size
      setShowSearchInput(true);
    } else {
      // Optionally, hide the search input in mobile size if desired
      // This line can be adjusted based on your UI logic needs
      setShowSearchInput(false);
    }
  };

  // Add event listener for resize events
  window.addEventListener('resize', handleResize);

  // Initial check to set the correct state based on the current window width
  handleResize();

  return () => {
    // Cleanup the event listener on component unmount
    window.removeEventListener('resize', handleResize);
  };
}, []);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const closeSearch = () => {
    setShowSearchInput(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const searchCompanies = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/navCompanies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchText: searchQuery, limit: 5, offset: 0 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // console.log('company search data', data);
      setSearchResults(data);
    } catch (error) {
      console.error("Fetch error: ", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCompanies(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);


    useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the search input and the NavStockCard
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          (!navStockCardRef.current || !navStockCardRef.current.contains(event.target))) {
        // Clear search query without hiding the search input or NavStockCard
        setSearchQuery(''); // Clear the search query only
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Dependency array remains empty



  return (
   <>
    <div className="flex items-center justify-between" ref={searchRef}>
      {/* Conditionally render the search icon only if the search input is not shown */}
      {!showSearchInput && (
        <div className="md:hidden">
          <button onClick={() => setShowSearchInput(true)} className="p-2">
            <FaSearch className="text-xl" />
          </button>
        </div>
      )}

      {/* This condition checks if the search input should be shown based on the showSearchInput state or if the window width is >= 768px */}
      {showSearchInput || window.innerWidth >= 768 ? (
        <div className={`absolute top-0 inset-x-0 ${showSearchInput ? 'block' : 'hidden'} md:relative md:block md:top-auto md:inset-x-0`}>
      
          <input
            autoFocus={showSearchInput}
            type="text"
            placeholder="Search by company name or ticker"
            className="search_input peer w-full px-3 py-2 mt-16 md:mt-0 z-40 bg-white min-w-[250px] md:min-w-[300px]" // Increased margin-top for mobile
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isSearching && (
            <ul className="absolute w-full  bg-white border border-gray-200 rounded-md shadow-lg z-30">
              {Array.from({ length: 2 }).map((_, index) => (
                <li key={index} className="px-4 py-4 animate-pulse flex items-center">
                  <div className="bg-gray-300 rounded-md h-6 w-full"></div>
                </li>
              ))}
            </ul>
          )}
          {searchResults.length > 0 && (
              <div ref={navStockCardRef}> {/* Add the ref here */}
                <NavStockCard searchResults={searchResults} 
                isCardVisible={isCardVisible} 
                setIsCardVisible={setIsCardVisible} />
              </div>
            )}
        </div>
      ) : null}
    </div>
  </>
);
};

export default CompanySearch;

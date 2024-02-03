import { useEffect, useState } from 'react';

const CompanySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Update to search based on user input
  const searchCompanies = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchText: searchQuery, limit: 5, offset: 0 }), // Adjust according to your needs
        // body: JSON.stringify({ limit: limit, offset: offset, searchText: searchQuery }),

      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received Search Data:', data);
      setSearchResults(data); // Store the search results
    } catch (error) {
      console.error("Fetch error: ", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Effect to search when the searchQuery changes, debounce for performance
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCompanies(searchQuery.trim());
      } else {
        setSearchResults([]); // Clear results if search query is cleared
      }
    }, 500); // Debounce delay

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return (
    <div className="relative flex-grow ml-auto mr-4 max-w-xs">
      <input
        type="text"
        placeholder="Search by company name or ticker"
        required
        className="search_input peer w-full px-3 py-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isSearching && <div>Searching...</div>}
      {searchResults.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {searchResults.map((company) => (
            <li key={company.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {company.Name} - {company.Stock}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompanySearch;

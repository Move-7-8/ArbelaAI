// import { useState, useEffect, useCallback } from 'react';
// import debounce from 'lodash.debounce'; // Ensure debounce is imported, for example, from Lodash

// import StockCard from './StockCard';
// import OpenCard from './OpenCard';
// import { categoryMap } from '../constants'; // Import your categoryMap


// function Catalog({ searchText, selectedCategory, preloadedData }) {
//     // const [tickers, setTickers] = useState([]);
//     const [tickers, setTickers] = useState(preloadedData || []);
//     const [visibleCount, setVisibleCount] = useState(12); // Number of visible tickers
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const selectCompany = (company) => {
//         setSelectedCompany(company); 
//     };
    
//     const itemPerLoad = 12;

//     const fetchData = async (shouldAppend = false, searchQuery = '', fetchAll = false) => {
//     setLoading(true); // Set loading true at the beginning of fetch
//     try {
//         const offset = shouldAppend && !searchQuery ? tickers.length : 0;
//         let limit = fetchAll ? 2000 : itemPerLoad;

//         const response = await fetch(`/api/companies?limit=${limit}&offset=${offset}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ limit: limit, offset: offset, searchText: searchQuery, category: selectedCategory }),
//         });

//         const fetchedData = await response.json();
//         if (!shouldAppend || searchQuery || selectedCategory) {
//             setTickers(fetchedData);
//         } else {
//             setTickers(prevTickers => [...prevTickers, ...fetchedData]);
//         }
//     } catch (error) {
//         console.error("Fetch error: ", error);
//     } finally {
//         setLoading(false); // Ensure loading is set to false after fetch completes or fails
//     }
// };

//  useEffect(() => {
//         if (preloadedData) {
//             setTickers(preloadedData);
//             setLoading(false); // Set loading false if preloadedData is used
//         } else {
//             fetchData(); // Fetch data on component mount
//         }
//     }, []); 

//     const handleLoadMore = () => {
//         fetchData(true).then(() => {
//             setVisibleCount(prevCount => prevCount + itemPerLoad);
//         });
//     }; 

//     const debounceSearch = useCallback(debounce((search) => {
//       fetchData(false, search, true); // Always replace the tickers on search
//     }, 200), []);

//     //Use Effect to handle search changes
//     useEffect(() => {
//         if (searchText && searchText.length > 2) { 
//             debounceSearch(searchText);
//         } else if (!searchText) {
//             fetchData(); // Reload initial data if search text is cleared
//         }
//     }, [searchText, debounceSearch]);
      
//     //Use Effect to handle category changes
//     useEffect(() => {
//       if (selectedCategory) {
//           fetchData(false, searchText, false, selectedCategory); // Call fetchData with the selected category
//       }
//     }, [selectedCategory]);
  
//     //Use Effect to handle initial data load
//     useEffect(() => {
//       fetchData();
//     }, []); 


//     const filteredTickers = tickers.filter(company => {

//         const companyName = company.Name;
//         const industry = company.GICsIndustryGroup; 
//         const price = company.Price; 
//         const change = (company.Change / company.Price).toFixed(2)
    
//         const isCategoryMatch = !selectedCategory || selectedCategory.name === 'All Industries' ? true : company.GICsIndustryGroup === selectedCategory.name;
//         return isCategoryMatch &&
//             ((typeof companyName === 'string' && companyName.toLowerCase().includes(searchText.toLowerCase())) ||
//                 (typeof industry === 'string' && industry.toLowerCase().includes(searchText.toLowerCase())));
//     });
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

import StockCard from './StockCard';
import { categoryMap } from '../constants';

function Catalog({ searchText, selectedCategory, preloadedData }) {
    const [tickers, setTickers] = useState(preloadedData || []);
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    const selectCompany = (company) => setSelectedCompany(company);
    const itemPerLoad = 12;

    const fetchData = async (shouldAppend = false, searchQuery = '') => {
        setLoading(true);
        try {
            const offset = shouldAppend ? tickers.length : 0;
            const limit = itemPerLoad;
            // Determine the API endpoint based on the context of the search
            const apiRoute = searchQuery ? 'api/navCompanies' : 'api/companies';
            const bodyContent = { limit, offset, searchText: searchQuery, category: selectedCategory };

            const response = await fetch(`/${apiRoute}?limit=${limit}&offset=${offset}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyContent),
            });

            const fetchedData = await response.json();
            setTickers(shouldAppend ? prevTickers => [...prevTickers, ...fetchedData] : fetchedData);
        } catch (error) {
            console.error("Fetch error: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch data on component mount or when preloadedData changes
        setLoading(true);
        fetchData();
    }, [preloadedData]);

    const handleLoadMore = () => {
        fetchData(true).then(() => setVisibleCount(prevCount => prevCount + itemPerLoad));
    };

    const debounceSearch = useCallback(debounce((search) => {
        fetchData(false, search); // Always replace the tickers on search
    }, 200), []);

    useEffect(() => {
        if (searchText && searchText.length > 2) {
            debounceSearch(searchText);
        } else if (!searchText && selectedCategory) {
            // Reload initial data if search text is cleared or category is selected
            fetchData(false, '');
        }
    }, [searchText, selectedCategory, debounceSearch]);

 return (
 <div className="w-full px-28 pt-10 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    // Render adjusted skeleton loaders when loading
                    Array.from({ length: visibleCount }).map((_, index) => (
                        <div key={index} className="bg-gray-200 flex flex-col w-full mx-auto border border-gray-200 rounded-lg shadow" style={{ width: '270px', height: 'auto' }}>
                            
                            <div className="px-5 mt-5 space-y-3 flex-grow flex flex-col justify-between">
                                <div className="h-6 bg-gray-200 rounded" style={{ height: '30px' }}></div> {/* Mimic Company Name Placeholder */}
                                <div className="h-4 bg-gray-200 rounded w-3/4" style={{ height: '25px' }}></div> {/* Mimic Stock Placeholder */}
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div> {/* Mimic Price Placeholder */}
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div> {/* Mimic Change Placeholder */}
                                </div>
                                <div className="h-4 bg-gray-200 rounded" style={{ height: '25px' }}></div> {/* Mimic Industry Placeholder */}
                            </div>
                        </div>
                    ))
                ) : (
                    // Render StockCards when not loading
                    tickers.slice(0, visibleCount).map(company => (
                        <div onClick={() => selectCompany(company)} key={company.Stock} className="w-full max-w-sm mx-auto" style={{ maxWidth: '270px', height: 'auto' }}>
                            <StockCard company={company} />
                        </div>
                    ))
                )}
            </div>

            {!loading && searchText.length === 0 && (
                <div className="flex justify-center mt-4">
                    <button onClick={handleLoadMore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-20 mt-8 rounded">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
export default Catalog;
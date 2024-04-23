import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

import StockCard from './StockCard';
import { categoryMap } from '../constants';

// CATALOG COMPONENTS

function Catalog({ searchText, selectedCategory, preloadedData, sortBy }) {
    const [tickers, setTickers] = useState(preloadedData || []);
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    const selectCompany = (company) => setSelectedCompany(company);
    const itemPerLoad = 12;


    //TEST
    // const fetchData = async (shouldAppend = false, searchQuery = '', category = selectedCategory) => {
    //     setLoading(true);
    //     try {
    //         const offset = shouldAppend ? tickers.length : 0;
    //         const limit = itemPerLoad;
    //         const sortby = sortBy;
            
    //         // Determine the API endpoint based on the context of the search
    //         const apiRoute = searchQuery ? 'api/navCompanies' : 'api/companies';
    //         const bodyContent = { limit, offset, searchText: searchQuery, category: category, sortby: sortBy };
    //         console.log('Sending Request with Body:', bodyContent);

    //         // const bodyContent = { limit, offset, searchText: searchQuery, category: selectedCategory, sortby: sortby };
    //         console.log('Selected Category in Catalog:', selectedCategory);

    //         const response = await fetch(`/${apiRoute}?limit=${limit}&offset=${offset}`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(bodyContent),
    //         });

    //         const fetchedData = await response.json();
    //         setTickers(shouldAppend ? prevTickers => [...prevTickers, ...fetchedData] : fetchedData);
    //     } catch (error) {
    //         console.error("Fetch error: ", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     // Fetch data on component mount or when preloadedData changes
    //     setLoading(true);
    //     fetchData();
    // }, [preloadedData, sortBy]);

    const fetchData = async (shouldAppend = false, searchQuery = '', category = selectedCategory) => {
        setLoading(true);
        try {
            const offset = shouldAppend ? tickers.length : 0;
            const limit = itemPerLoad;
            const sortby = sortBy;
    
            const apiRoute = searchQuery ? 'api/navCompanies' : 'api/companies';
            const bodyContent = { limit, offset, searchText: searchQuery, category: category, sortby: sortBy };
            console.log('Sending Request with Body:', bodyContent);
    
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
        fetchData();
    }, [preloadedData, sortBy, selectedCategory]);
    

    // const handleLoadMore = () => {
    //     fetchData(true).then(() => setVisibleCount(prevCount => prevCount + itemPerLoad));
    // };

    const handleLoadMore = async () => {
        await fetchData(true);
        setVisibleCount(prevCount => prevCount + itemPerLoad);
    };
    

    // const debounceSearch = useCallback(debounce((search) => {
    //     fetchData(false, search); // Always replace the tickers on search
    // }, 200), []);

    const debounceSearch = useCallback(debounce((search, category) => {
        fetchData(false, search, category); // Adjust fetchData to accept and handle category
    }, 200), [selectedCategory]); // Adding selectedCategory in dependency array
    
    // useEffect(() => {
    //     if (searchText && searchText.length > 2) {
    //         // If searchText exists and is longer than 2 characters, perform a debounced search
    //         debounceSearch(searchText);
    //     } else {
    //         // If searchText is cleared, fetch all data again, ignoring selectedCategory
    //         fetchData(false, '');
    //     }
    // }, [searchText, selectedCategory, debounceSearch]);

    useEffect(() => {
        if (searchText && searchText.length > 2) {
            debounceSearch(searchText, selectedCategory); // Pass current selectedCategory
        } else {
            // If searchText is cleared, ensure it fetches all data again considering the selected category
            fetchData(false, '', selectedCategory);
        }
    }, [searchText, selectedCategory, debounceSearch]); // Ensure selectedCategory is a dependency
    
    
 return (

 <div className="w-full px-15 pt-10 py-2">
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

            {!loading && searchText.length === 0 &&(
                <div className="flex justify-center mt-4">
                    <button onClick={handleLoadMore} className="uppercase text-sm rounded-full py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 mb-4 ml-4 mr-4 border border-[#FF6665] text-[#FF6665]">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
export default Catalog;

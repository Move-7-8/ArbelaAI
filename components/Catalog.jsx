import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce'; // Ensure debounce is imported, for example, from Lodash

import StockCard from './StockCard';
import OpenCard from './OpenCard';
import { categoryMap } from '../constants'; // Import your categoryMap


function Catalog({ searchText, selectedCategory, preloadedData }) {
    // const [tickers, setTickers] = useState([]);
    const [tickers, setTickers] = useState(preloadedData || []);
    const [visibleCount, setVisibleCount] = useState(12); // Number of visible tickers
    const [selectedCompany, setSelectedCompany] = useState(null);

    const selectCompany = (company) => {
        setSelectedCompany(company); 
    };
    
    const itemPerLoad = 12;

    const fetchData = async (shouldAppend = true, searchQuery = '', fetchAll = false) => {
        try {
          const offset = shouldAppend ? tickers.length : 0;
          let limit = fetchAll ? 2000 : itemPerLoad; // Use 2000 if fetching all, else itemPerLoad
      
          const response = await fetch(`/api/companies?limit=${limit}&offset=${offset}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ limit: limit, offset: offset, searchText: searchQuery }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const fetchedData = await response.json();
          setTickers(prevTickers => shouldAppend ? [...prevTickers, ...fetchedData] : fetchedData);
        } catch (error) {
          console.error("Fetch error: ", error);
        }
      };
      


    const handleLoadMore = () => {
        fetchData(true).then(() => {
            setVisibleCount(prevCount => prevCount + itemPerLoad);
        });
    }; 

      const debounceSearch = useCallback(debounce((search) => {
        fetchData(false, search, true); 
      }, 200), []); 
      
      useEffect(() => {
        if (searchText && searchText.length > 2) { 
          debounceSearch(searchText);
        }
      }, [searchText, debounceSearch]);
            

    const filteredTickers = tickers.filter(company => {

        const companyName = company.Name;
        const industry = company.GICsIndustryGroup; 
        const price = company.Price; 
        const change = (company.Change / company.Price).toFixed(2)

        const isCategoryMatch = selectedCategory
            ? categoryMap[selectedCategory].includes(industry)
            : true;

        return isCategoryMatch &&
            ((typeof companyName === 'string' && companyName.toLowerCase().includes(searchText.toLowerCase())) ||
                (typeof industry === 'string' && industry.toLowerCase().includes(searchText.toLowerCase())));
    });

    return (
        <div className="w-full px-28 pt-10 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTickers.slice(0, visibleCount).map(company => (
                    <div onClick={() => selectCompany(company)} key={company.Stock}>
                        <StockCard company={company}  />
                    </div>
                ))}
            </div>

                <div className="flex justify-center mt-4">
                    <button onClick={handleLoadMore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-20 mt-8 rounded">
                        Load More
                    </button>
                </div>

        </div>
    );
}

export default Catalog;
import { useState, useEffect } from 'react';
import StockCard from './StockCard';
import OpenCard from './OpenCard';

import { categoryMap } from '../constants'; // Import your categoryMap

function Catalog({ searchText, selectedCategory }) {
    const [tickers, setTickers] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12); // Number of visible tickers
    const [selectedCompany, setSelectedCompany] = useState(null);

    const selectCompany = (company) => {
        setSelectedCompany(company); 
    };
    
    // In your fetchData function
    const fetchData = async () => {
        try {
            const response = await fetch("/api/companies");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const fetchedData = await response.json();
            console.log("Fetched Data Companies: ", fetchedData); // Debug: log fetched data
            // Ensure setTickers always receives an array.
            // setTickers(Array.isArray(fetchedData.companies) ? fetchedData.companies : []);
            //Testing new line:
            setTickers(Array.isArray(fetchedData) ? fetchedData : []);

        } catch (error) {
            console.error("Fetch error: ", error);
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 12);
    };

    useEffect(() => {
        fetchData();
    }, []);

    

    const filteredTickers = tickers.filter(company => {
        const companyName = company['Company name'];
        const industry = company['GICsindustrygroup']; 
        const price = company['price']; 
        const change = (company['Change (%)'] / company['Price']).toFixed(2)

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
                    <div onClick={() => selectCompany(company)} key={company.ASX_code}>
                        <StockCard company={company}  />
                    </div>
                ))}
            </div>

            {visibleCount < filteredTickers.length && (
                <div className="flex justify-center mt-4">
                    <button onClick={handleLoadMore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-20 mt-8 rounded">
                        Load More
                    </button>
                </div>
            )}

            {/* {selectedCompany && (
                <OpenCard company={selectedCompany} onClose={() => setSelectedCompany(null)} />
            )} */}
        </div>
    );
}

export default Catalog;
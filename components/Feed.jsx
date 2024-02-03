'use client';

import { useState, useEffect, Fragment } from 'react';
import Catalog from './Catalog';
import { Listbox } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing ChevronDown icon from FontAwesome
import { categoryMap } from '../constants'; // Import your categoryMap


const sortOptions = [
  { id: 1, name: 'Name' },
  { id: 2, name: 'Price' },
  // ... add more sort options
];

const Feed = ({ preloadedData }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Renamed to selectedCategory

  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [industries, setIndustries] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    // Optionally debounce this call
    // fetchData(false, value); // Pass false to not append data, and pass the search value
};

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };


  useEffect(() => {
    const fetchPosts = async () => {

      const response = await fetch(`/api/companies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
          const data = await response.json();
      console.log('data',)
      const uniqueIndustries = [...new Set(data.GICsIndustryGroup)];
      setIndustries(uniqueIndustries.map((GICsIndustryGroup, index) => ({ id: index + 1, name: GICsIndustryGroup })));
          }
  
    fetchPosts();
  }, []);

  // JSON Stock Attribute Calculations (Equivalent of calculations in @StockCard.jsx)
  // companiesData.forEach(company => {
  //   company.change = ((company.Price - company.LastPrice) / company.LastPrice) * 100;

  //   const rangeVolatility = ((company.fiftyTwoWeekHigh - company.fiftyTwoWeekLow) / company.fiftyTwoWeekLow) * 100;
  //   const percentageChangeVolatility = (company.fiftyTwoWeekChangePercent + company.twoHundredDayAverageChangePercent + company.fiftyDayAverageChangePercent) / 3;
  //   company.volatility = (0.5 * rangeVolatility) + (0.5 * percentageChangeVolatility);
    
  //   company.liquidity = (0.8 * company.averageDailyVolume3Month) + (0.2 * company.regularMarketVolume);
  // });



  return (
       <section>
      <div className="feed">
        {/* New div for Search and Sort By */}
          <div className="flex space-x-8 w-full mx-4"> 
          <form className="relative flex-center w-full md:w-96">
            <input
                type="text"
                placeholder="Search by coompany name or ticker"
                value={searchText}
                onChange={handleSearchChange}
                required
                className="search_input peer w-full"
            />
        </form>
          <Listbox value={sortBy} onChange={setSortBy}>
            {({ open }) => (
              <Fragment>
                <div className="relative w-40">
                <Listbox.Button className="dropdown-button dropdown-button-sort flex justify-between items-center h-10 px-3">
                  <span className="">{sortBy || 'Sort By'}</span> {/* Add margin to the right of the text */}
                  {open ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
                </Listbox.Button>

                  {open && (
                    <Listbox.Options className="listbox-options absolute mt-2 w-full z-10">
                      {sortOptions.map((option) => (
                        <Listbox.Option key={option.id} value={option.name}>
                          {({ active, selected }) => (
                            <div className={`listbox-option ${active ? 'bg-blue-500 text-white' : 'text-black'} px-4 py-2`}>
                              {option.name}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  )}
                </div>
              </Fragment>
            )}
          </Listbox>
        </div>

        {/* Industry Filter - Unchanged */}
        {/* Filters Section */}
    <div className="flex space-x-4 w-full">
   <Listbox value={selectedCategory} onChange={category => {
        setSelectedCategory(category);
        console.log('Selected Category:', category); // Log the selected category
    }} className="w-1/2 max-w-xs">
        {({ open }) => (
          
          <Fragment>
            <div className="relative w-full">
              <Listbox.Button className="dropdown-button dropdown-button-category flex justify-between items-center h-10 px-3">
                <span>{selectedCategory || 'Filters'}</span>
                {open ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
              </Listbox.Button>
              {open && (
                <Listbox.Options className="listbox-options absolute mt-2 w-full z-10">
                  <div className="px-4 py-2 text-gray-700 text-sm">Select Industry:</div>
                  {Object.keys(categoryMap).map((category) => (
                    <Listbox.Option key={category} value={category}>
                      {({ active, selected }) => (
                        <div className={`listbox-option ${active ? 'bg-blue-500 text-white' : 'text-black'} px-4 py-2`}>
                          {category}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              )}
            </div>
          </Fragment>
        )}
      </Listbox>
    </div>

  </div>
  
      <Catalog searchText={searchText} selectedCategory={selectedCategory} preloadedData={preloadedData}/>
    </section>
  );
}
export default Feed;
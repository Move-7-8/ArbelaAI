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

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Renamed to selectedCategory

  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [industries, setIndustries] = useState([]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  }
  
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/companies');
      const data = await response.json();
      const uniqueIndustries = [...new Set(data.industry)];
      setIndustries(uniqueIndustries.map((industry, index) => ({ id: index + 1, name: industry })));
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
        <form className="relative w-full flex-center">
          <input
            type="text"
            placeholder="Search by company name or ticker"
            value={searchText}
            onChange={handleSearchChange}
            required
            className="search_input peer"
          />
        </form>
        <div className="flex space-x-4">
        <Listbox value={selectedCategory} onChange={setSelectedCategory}>
              {({ open }) => (
                <Fragment>
                  <div className="relative w-96">
                    <Listbox.Button className="dropdown-button dropdown-button-category flex justify-between items-center h-10 px-3">
                      <span>{selectedCategory || 'Select Industry'}</span>
                      {open ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />} {/* Conditional rendering based on whether the list is open */}
                    </Listbox.Button>
                    {open && (
                      <Listbox.Options className="listbox-options absolute mt-2 w-full z-10">
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
            <Listbox value={sortBy} onChange={setSortBy}>
  {({ open }) => (
    <Fragment>
      <div className="relative w-28">
        <Listbox.Button className="dropdown-button dropdown-button-sort flex justify-between items-center h-10 px-3">
          <span>{sortBy || 'Sort By'}</span>
          {open ? 
            <FaChevronUp className="h-4 w-4 text-gray-500" /> : 
            <FaChevronDown className="h-4 w-4 text-gray-500" />} {/* Adjusted size and color */}
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
      </div>

      <Catalog searchText={searchText} selectedCategory={selectedCategory} />
    </section>
  );
}

export default Feed;


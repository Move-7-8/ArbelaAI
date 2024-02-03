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
};

    const handleCategoryChange = (category) => {
        if (selectedCategory.includes(category)) {
            setSelectedCategory(selectedCategory.filter(c => c !== category));
        } else {
            setSelectedCategory([...selectedCategory, category]);
        }
    };

    useEffect(() => {
      const fetchIndustries = async () => {
        const response = await fetch(`/api/industries?uniqueIndustries=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Map your data to the existing structure
          const industriesData = data.map((code, index) => ({ id: index + 1, name: code })); // Adjusted index to start from 1
          // Prepend the "All Industries" option to your industries array
          const allIndustriesOption = [{ id: 0, name: 'All Industries' }];
          const industriesWithAllOption = allIndustriesOption.concat(industriesData);
          setIndustries(industriesWithAllOption);
        }
      };
      
    fetchIndustries();
  }, []);
  
  return (
       <section>
      <div className="feed">
        {/* New div for Search and Sort By */}
          <div className="flex space-x-8 w-full mx-4"> 
          <form className="relative flex-center w-full md:w-96">
            <input
                type="text"
                placeholder="Search by company name or ticker"
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
                    {industries.map((industry) => (
                      <Listbox.Option key={industry.id} value={industry.name}>
                        {({ active, selected }) => (
                          <div className={`listbox-option ${active ? 'bg-blue-500 text-white' : 'text-black'} px-4 py-2`}>
                            {industry.name}
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

        {/* Filters Section */}
    <div className="flex space-x-4 w-full">
        <Listbox value={selectedCategory} onChange={(category) => {
        setSelectedCategory(category);
        console.log('Selected Category:', category); // Correctly log the selected category
          }} className="w-1/2 max-w-xs">
            {({ open }) => (
              <Fragment>
                <div className="relative w-full">
                  <Listbox.Button className="dropdown-button dropdown-button-category flex justify-between items-center h-10 px-3">
                    <span>{selectedCategory.name || 'Filters'}</span>
                    {open ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
                  </Listbox.Button>
                  {open && (
                    <Listbox.Options className="listbox-options absolute mt-2 w-full z-10">
                      <div className="px-4 py-2 text-gray-700 text-sm">Select Industry:</div>
                      {industries.map((industry) => (
                        <Listbox.Option key={industry.id} value={industry}>
                          {({ active, selected }) => (
                            <div className={`listbox-option ${active ? 'bg-blue-500 text-white' : 'text-black'} px-4 py-2`}>
                              {industry.name}
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
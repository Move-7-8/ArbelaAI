
'use client';

import { useState, useEffect, Fragment } from 'react';
import Catalog from './Catalog';
import { Listbox } from '@headlessui/react';
import { FaChevronDown, FaChevronUp, FaLongArrowAltDown, FaLongArrowAltUp, FaSortDown, FaSortUp } from 'react-icons/fa'; // Importing ChevronDown icon from FontAwesome
// import { categoryMap } from '../constants'; // Import your categoryMap
import Sort from './Sort'; // Adjust the path if necessary


const sortOptions = [
  // { id: 1, name: 'Alphabetical', icon: null },
  { id: 2, name: 'High Market Cap UP', icon:<FaLongArrowAltUp />},
  { id: 3, name: 'Low Market Cap DOWN', icon: <FaLongArrowAltDown /> },
  { id: 4, name: 'Gainers UP', icon:<FaLongArrowAltUp /> },
  { id: 5, name: 'Losers DOWN', icon: <FaLongArrowAltDown /> },
  { id: 6, name: 'Growth Stocks UP', icon: <FaLongArrowAltUp />},
  { id: 7, name: 'Value Stocks UP', icon: <FaLongArrowAltUp /> },
];


const Feed = ({ preloadedData }) => {

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // Use null to indicate no category is selected
  const [sortBy, setSortBy] = useState(sortOptions[0].name);
  const [industries, setIndustries] = useState([]);
  const [isViewAll, setIsViewAll] = useState(false);

 // Log preloadedData whenever it changes, including when the component mounts
  useEffect(() => {
  }, [preloadedData]);

  useEffect(() => {
    const fetchIndustries = async () => {
      const response = await fetch(`/api/industries?uniqueIndustries=true`);
      if (response.ok) {
        const data = await response.json();
        const filteredData = data.filter(industryArray => 
          industryArray.length > 0 && industryArray.some(ind => ind.trim().length > 0) // Filters out empty arrays or arrays with only empty strings
        );
        const industriesData = filteredData.map((industryArray, index) => ({
          id: index + 1,
          name: industryArray.join(', ') // Assuming you might want to join names if there are multiple; adjust as needed
        }));
        const allIndustriesOption = [{ id: 0, name: 'All Industries' }];
        setIndustries(allIndustriesOption.concat(industriesData));
      }
    };
    fetchIndustries();
  }, []);
  

  // Initialize sortBy state with the name of the first sort option
  useEffect(() => {
    if (sortOptions.length > 0 && !sortBy) {
      setSortBy(sortOptions[0].name);
    }
  }, [sortOptions, sortBy]);

  const toggleViewAll = () => setIsViewAll(!isViewAll);
  
  return (
    <section>
      <div className="sm: p-4 feed">

            {/* Search and Sort Section - Adjusted for mobile responsiveness */}
      <div className="flex flex-col space-y-4 w-full mx-4 md:flex-row md:space-x-8 md:space-y-0">
        <form className="relative w-full">
          <input
            type="text"
            placeholder="Search by company name or ticker"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            required
            className="search_input peer rounded-full w-full"
          />
        </form>
        <Sort sortBy={sortBy} setSortBy={setSortBy} sortOptions={sortOptions} />
      </div>

        {/* Filters Section - Adjusted for mobile responsiveness */}
      <div className="flex flex-col space-y-4 w-full mx-4 md:flex-row md:space-x-4 md:space-y-0">
      <Listbox value={selectedCategory} onChange={(newCategory) => {
          setSelectedCategory(newCategory);
      }} className="w-full">
          {({ open }) => (
              <>
            <div className="relative w-full">
                <Listbox.Button className="dropdown-button text-sm flex text-gray-500 justify-between items-center w-full h-10 px-3 shadow-md rounded-full">
                    <span>{selectedCategory && selectedCategory.name !== 'All Industries' ? selectedCategory.name : 'Industry Filter'}</span> 
                    {open ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
                </Listbox.Button>
                {open && (
                    <Listbox.Options className="listbox-options absolute mt-2 w-full z-10 bg-white overflow-auto shadow-lg rounded-full p-4" style={{maxHeight: '20rem'}}>
                    <div className="text-gray-700 text-xs mb-4 uppercase">Select Industry:</div>

                        <div className="grid grid-cols-2 gap-4">
                            {industries.slice(0, isViewAll ? industries.length : 6).map((industry) => (
                            <Listbox.Option key={industry.id} value={industry} as={Fragment}>
                                {({ active, selected }) => (
                                <div 
                                    className={`flex rounded-full justify-start items-center text-xs cursor-pointer border px-4 py-2 ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
                                    style={{ 
                                        backgroundColor: selected ? 'rgba(255, 102, 101, 0.5)' : '', 
                                        borderColor: active ? 'rgba(255, 102, 101, 0.5)' : 'transparent',
                                        borderWidth: active ? '2px' : '1px', // Adjust border width for visibility
                                        borderStyle: 'solid',
                                        height: '3.2rem' 
                                    }}
                                >
                                    {industry.name}
                                </div>
                                )}
                            </Listbox.Option>
                            ))}
                        </div>
                        {industries.length > 6 && (
                            <div className="flex flex-col items-center mt-2">
                                <button className="text-center m-4 uppercase text-grey-500 text-xs" onClick={toggleViewAll}>
                                    {isViewAll ? "View Less" : "View More"}
                                </button>
                                <div className="w-full border-t border-gray-300 my-2"></div>
                            </div>
                        )}
                    </Listbox.Options>
                )}
            </div>
        </>
    )}
</Listbox>
        </div>
      </div>
  
      <Catalog searchText={searchText} selectedCategory={selectedCategory} sortBy={sortBy} preloadedData={preloadedData}/>
    </section>
  );
}

export default Feed;

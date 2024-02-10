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
  // const [selectedCategory, setSelectedCategory] = useState(''); // Renamed to selectedCategory
  const [selectedCategory, setSelectedCategory] = useState(null); // Use null to indicate no category is selected
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [industries, setIndustries] = useState([]);
  const [isViewAll, setIsViewAll] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

};

 // Log preloadedData whenever it changes, including when the component mounts
  useEffect(() => {
    console.log('Preloaded Data:', preloadedData);
    // Here you might also set state based on preloadedData, for example:
    // setIndustries(preloadedData.industries || []);
  }, [preloadedData]);



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

  // Update the onChange handler for Listbox to handle "All Industries"
  const handleIndustryChange = (industry) => {
    setSelectedCategory(industry); // Directly set the selected category based on selection
  };

  // Initialize sortBy state with the name of the first sort option
  useEffect(() => {
    if (sortOptions.length > 0 && !sortBy) {
      setSortBy(sortOptions[0].name);
    }
  }, [sortOptions, sortBy]);

  const toggleViewAll = () => setIsViewAll(!isViewAll);
  // Assuming `selectedCategory` is now an object with {id, name}, adjust accordingly
  const displayCategoryName = selectedCategory ? selectedCategory.name : 'Filters';
  
  return (
       <section>
      <div className="feed">
        {/* New div for Search and Sort By */}
 <div className="flex space-x-8 w-full mx-4" > {/* If you wish the entire container to be at least 40rem */}
    <form className="relative flex-center w-full" style={{ width: '40rem' }}> {/* Directly applying width: 40rem */}
            <input
                type="text"
                placeholder="Search by company name"
                value={searchText}
                onChange={handleSearchChange}
                required
                className="search_input peer rounded-full w-full"
            />
        </form>
          {/* "Sort by:" label and dropdown together */}
      <div className="flex items-center flex-shrink-0 space-x-2">
        <span className="text-gray-500 text-sm whitespace-nowrap">Sort by:</span>
        <Listbox value={sortBy} onChange={setSortBy}>
          {({ open }) => (
            <>
              <div className="relative ml-2">
                <Listbox.Button className="dropdown-button-sort flex text-sm justify-between items-center h-10 px-3 shadow-md rounded-full text-gray-500" style={{ minWidth: '140px' }}>
                  <span>{sortBy}</span>
                  {open ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
                </Listbox.Button>
                {open && (
  <Listbox.Options className="listbox-options absolute mt-2 z-10 bg-white overflow-auto shadow-lg rounded-full p-4" style={{ width: '140px', maxHeight: '20rem' }}>
                    {sortOptions.map((option) => (
                      <Listbox.Option key={option.id} value={option.name}>
                        {({ active, selected }) => (
                                <div className={`flex rounded-full justify-start items-center text-sm mb-2 cursor-pointer border px-4 py-2 bg-gray-100 ${selected ? 'bg-[rgba(255,102,101,0.5)] text-white' : 'text-black'} ${active ? 'border border-[rgba(255,102,101,0.5)]' : ''}`}>
                            {option.name}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </div>
            </>
          )}
        </Listbox>
        </div>

        </div>
{/* Filters Section */}
<div className="flex space-x-4 w-full">
  <Listbox value={selectedCategory} onChange={setSelectedCategory} className="w-full max-w-xs">
    {({ open }) => (
      <>
        <div className="relative w-full">
          <Listbox.Button className="dropdown-button text-sm flex text-gray-500 justify-between items-center w-full h-10 px-3 shadow-md rounded-full">
             <span>Filters</span> 
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
                      className={`flex rounded-full justify-start items-center text-sm cursor-pointer rounded-full border px-4 py-2 ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
                      style={{ 
                        backgroundColor: selected ? 'rgba(255, 102, 101, 0.5)' : '', 
                        borderColor: active ? 'rgba(255, 102, 101, 0.5)' : 'transparent',

                          borderWidth: active ? '2px' : '1px', // Adjust border width for visibility
                        borderStyle: 'solid',
                        height: '2.9rem' 
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
                    {isViewAll ? "View Less" : "View All"}
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
  
      <Catalog searchText={searchText} selectedCategory={selectedCategory} preloadedData={preloadedData}/>
    </section>
  );
}
export default Feed;
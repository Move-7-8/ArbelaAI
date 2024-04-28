import React from 'react';
import { Listbox } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sort = ({ sortBy, setSortBy, sortOptions }) => {
  const currentSortOption = sortOptions.find(option => option.name === sortBy);

  return (
    <div className="flex flex-end items-center flex-shrink-0 space-x-2">
      <span className="text-gray-500 text-sm whitespace-nowrap">Sort by:</span>
      <Listbox value={sortBy} onChange={setSortBy}>
        {({ open }) => (
          <>
            <div className="relative ml-2">
              <Listbox.Button className="dropdown-button-sort flex items-center justify-between text-sm h-10 px-3 shadow-md rounded-full text-gray-500" style={{ minWidth: '160px' }}>
                {/* Adjusted layout for text and icon in the button */}
                <div className="flex items-center">
                  {currentSortOption ? (
                    <>
                      <span className="mr-2">{currentSortOption.name.replace(" UP", "").replace(" DOWN", "")}</span>
                      <span>{currentSortOption.icon}</span>
                    </>
                  ) : (
                    <span>{sortBy}</span> // Fallback to just displaying the sortBy string if no match is found
                  )}
                </div>
                {open ? <FaChevronUp className="ml-2 h-4 w-4" /> : <FaChevronDown className="ml-2 h-4 w-4" />}
              </Listbox.Button>
              {open && (
                <Listbox.Options className="listbox-options absolute mt-2 z-10 bg-white overflow-auto shadow-lg rounded-full p-4" style={{ width: '140px', maxHeight: '20rem' }}>
                  {sortOptions.map((option) => (
                    <Listbox.Option key={option.id} value={option.name}>
                      {({ active, selected }) => (
                        <div className={`flex items-center justify-between rounded-full text-xs mb-2 cursor-pointer px-4 py-2 ${selected ? 'bg-[rgba(255,102,101,0.5)] text-white' : 'bg-gray-100 text-black'} ${active ? 'border border-[rgba(255,102,101,0.5)]' : ''}`}
                         style={{ height: '3.2rem' }}>
                          <span>{option.name.replace(" UP", "").replace(" DOWN", "")}</span>
                          <span className="ml-2">{option.icon}</span>
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
  );
};

export default Sort;


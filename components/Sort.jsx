// Sort.jsx
import React from 'react';
import { Listbox } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sort = ({ sortBy, setSortBy, sortOptions }) => {
  return (
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
  );
};

export default Sort;

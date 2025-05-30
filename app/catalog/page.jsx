'use client';

import { useState, useEffect, Fragment } from 'react';
// import Catalog from '@components/Catalog';
import Feed from '@components/Feed';
import { Listbox } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing ChevronDown icon from FontAwesome
import { categoryMap } from '@constants'; // Import your categoryMap

const CatalogFeed = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Renamed to selectedCategory

  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [industries, setIndustries] = useState([]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  }
  
  const fetchPosts = async () => {
    const response = await fetch('/api/companies');
    if (!response.ok) {
      // Handle non-OK responses here
      console.error('Failed to fetch:', response.statusText);
      return; // Prevent further execution
    }
    try {
      const data = await response.json();
      const uniqueIndustries = [...new Set(data.map(d => d.industry))];
      setIndustries(uniqueIndustries.map((industry, index) => ({ id: index + 1, name: industry })));
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
      
  return (
    <section className={`w-full flex-center flex-col mt-20 pt-10`}>
    <div className='mb-2 mt-12 text-center'>
        <h1 className='mb-4 text-7xl font-black' style={{ color: '#3A3C3E' }}>Find a Company</h1>
        <p className='text-lg' style={{ color: '#3A3C3E' }}>Select a US listed company you want to analyse</p>

      </div>

      <Feed
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </section>
  );
}



export default CatalogFeed;


'use client';

import { useState, useEffect, Fragment } from 'react';
// import Catalog from '@components/Catalog';
import Feed from '@components/Feed';
import { Listbox } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing ChevronDown icon from FontAwesome
import { categoryMap } from '@constants'; // Import your categoryMap


const sortOptions = [
  { id: 1, name: 'Name' },
  { id: 2, name: 'Price' },
  // ... add more sort options
];

const CatalogFeed = () => {
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

  return (
    <section className='mt-16'>
      <div className='mb-2 mt-12 text-center'>
        <h1 className='mb-4 text-7xl font-black text-black'>Company Catalog</h1>
        <p className='text-lg text-black'>Use our quality data to build your models</p>
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


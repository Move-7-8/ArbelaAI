// NavStockCard.jsx
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const NavStockCard = ({ searchResults, isCardVisible, setIsCardVisible }) => {
  // Function to truncate the company name if it's too long
  const cardRef = useRef(null);
  const truncateCompanyName = (name) => {
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };

    useEffect(() => {
  const handleClickOutside = (event) => {
  console.log("Document clicked");
  if (cardRef.current && !cardRef.current.contains(event.target)) {
    console.log("Click outside detected");
    setIsCardVisible(false);
  }
};


    // Add when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsCardVisible]);

 

  return (
    <ul ref={cardRef}  className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg z-30">
      {searchResults.map((company) => {
        // Modify the link path to include the ticker as a query parameter
        const linkPath = `/companies/${company.Name.toLowerCase().replace(/ /g, '')}?ticker=${encodeURIComponent(company.Stock)}`;
        return (
          <li key={company.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <Link href={linkPath} passHref>
              <div className="flex justify-between items-center cursor-pointer">
                <span className="text-gray-900 font-medium">{truncateCompanyName(company.Name)}</span>
                <span className="text-sm text-gray-500">{company.Stock}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavStockCard;

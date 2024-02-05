// NavStockCard.jsx
import React from 'react';
import Link from 'next/link';

const NavStockCard = ({ searchResults }) => {
  // Function to truncate the company name if it's too long
  const truncateCompanyName = (name) => {
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };

  return (
    <ul className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg z-30">
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

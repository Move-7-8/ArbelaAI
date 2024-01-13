import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
    const [isActive, setIsActive] = useState(false);

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);
    const handleFocus = () => setIsActive(true);
    const handleBlur = () => setIsActive(false);

    const borderColor = isActive ? '#7F6CD2' : 'rgba(80, 120, 235, 0.1)';

    return (
        <div className="p-4 flex justify-start items-center">
            <div 
                className="flex border rounded-full transition duration-300 w-3/4" 
                style={{ borderColor }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full p-2 rounded-l-full focus:outline-none"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} 
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <button 
                    className="bg-white p-2 rounded-r-full focus:outline-none"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                >
                    <FaSearch size={20} />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;







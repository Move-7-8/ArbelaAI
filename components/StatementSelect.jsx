// import React from 'react';
// import Link from 'next/link';
// import { Listbox } from '@headlessui/react';
// import { FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import ReactSimplyCarousel from 'react-simply-carousel';

// function StatementSelect({ company, ticker, industry }) {
//   const [selectedType, setSelectedType] = React.useState('');
//   const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);
//   const types = ['Quarterly', 'Annual', 'Cashflow', 'Announcements', 'Earnings Calls'];

//   const [activeRightHover, setActiveRightHover] = React.useState(false);
//   const [activeLeftHover, setActiveLeftHover] = React.useState(false);


//   const companyData = {
//     company,
//     ticker,
//     industry
//   };

//   return (
//     <div className="">
//       <div className="flex items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">
//           Analyse Latest Statements
//         </h3>
//       </div>
//       <div className="flex space-x-4 mb-4">
//         <Listbox value={selectedType} onChange={setSelectedType}>
//           {({ open }) => (
//             <div className="relative w-60">
//               <Listbox.Button className="dropdown-button dropdown-button-category flex justify-between items-center h-10 px-3 w-full backdrop-blur-md border z-10 border-gray-300 rounded-lg"
//                 style={{
//                   background: 'rgba(255, 255, 255, 0.8)',
//                   backgroundImage: 'linear-gradient(45deg, rgba(255,0,150,0.1), rgba(0,219,222,0.1))',
//                   backdropFilter: 'blur(10px)',
//                 }}
//               >
//                 <span>{selectedType || 'Statement Type'}</span>
//                 {open ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
//               </Listbox.Button>
//               {open && (
//                 <Listbox.Options className="listbox-options absolute mt-1 w-full z-10 backdrop-blur-md border border-gray-300 rounded-md shadow-lg"
//                   style={{
//                     background: 'rgba(255, 255, 255, 0.8)',
//                     backgroundImage: 'linear-gradient(45deg, rgba(255,0,150,0.1), rgba(0,219,222,0.1))',
//                     backdropFilter: 'blur(10px)',
//                   }}
//                 >
//                   {types.map((type) => (
//                     <Listbox.Option key={type} value={type}>
//                       {({ active, selected }) => (
//                         <div className={`cursor-pointer select-none relative px-4 py-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
//                           {type}
//                         </div>
//                       )}
//                     </Listbox.Option>
//                   ))}
//                 </Listbox.Options>
//               )}
//             </div>
//           )}
//         </Listbox>
//       </div>

// <div className="flex items-center justify-center pb-10 pt-5 px-40 carousel-fade-overlay flex-wrap" style={{ position: 'relative' }}>
//   <ReactSimplyCarousel
//     activeSlideIndex={activeSlideIndex}
//     onRequestChange={setActiveSlideIndex}
//     itemsToScroll={1}
//     speed={500} // 500ms transition speed
//     easing="linear"
//     forwardBtnProps={{
//       style: {
//         alignSelf: 'center',
//         background: 'gray',
//         border: 'none',
//         borderRadius: '50%',
//         color: 'white',
//         cursor: 'pointer',
//         fontSize: '20px',
//         height: 30,
//         lineHeight: 1,
//         textAlign: 'center',
//         width: 30,
//         position: 'absolute',
//         right: '100px',  // Adjust this value for positioning
//         paddingLeft: '4px',
//         zIndex: 9, // Add this line
//         background: activeRightHover ? 'gray' : 'darkgray',  // Add this line
//       },
//       onMouseOver: () => setActiveRightHover(true),  // Add this line
//       onMouseOut: () => setActiveRightHover(false),  // Add this line
//       children: <FaChevronRight className="h-6 w-6" />,
//     }}

//     backwardBtnProps={{
//       style: {
//         alignSelf: 'center',
//         background: 'gray',
//         border: 'none',
//         borderRadius: '50%',
//         color: 'white',
//         cursor: 'pointer',
//         fontSize: '20px',
//         height: 30,
//         lineHeight: 1,
//         textAlign: 'center',
//         width: 30,
//         position: 'absolute',
//         left: '140px',  // Adjust this value for positioning
//         zIndex: 9, // Add this line
//         background: activeLeftHover ? 'gray' : 'darkgray',  // Add this line

//       },
//       onMouseOver: () => setActiveLeftHover(true),  // Add this line
//       onMouseOut: () => setActiveLeftHover(false),  // Add this line    
//       children: <FaChevronLeft className="h-6 w-6" />,
//     }}
//   >
// {['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'].map((quarterName, index) => (
//   <div 
//       key={index} 
//       className="d-block px-4" 
//       style={{ 
//         width: '50%', 
//         padding: '0 40px',  // Add padding to space out the items
//         minWidth: '10px',  // Set a minimum width
//         transition: 'opacity 0.5s'  
//     }}
//   >
//     <Link
//         href={{
//             pathname: `/companies/${companyData.company.toLowerCase().replace(/ /g, '')}/${quarterName.toLowerCase().replace(/ /g, '')}`,
//             query: { company, ticker, industry, quarter: quarterName },
//         }}
//     >
// <div
//     className="backdrop-blur-md border border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 group-hover:scale-110"
//     style={{
//         background: 'rgba(255, 255, 255, 0.8)',
//         backgroundImage: 'linear-gradient(45deg, rgba(255,0,150,0.1), rgba(0,219,222,0.1))',
//         backdropFilter: 'blur(10px)',
//         height: '297px',
//         width: '210px', // changed from '210px' to '50%'
//     }}
// >
//           <span className="text-gray-500 mb-2">{quarterName} Statement</span>
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
//           </svg>
//       </div>
//     </Link>
//   </div>
// ))}
//       </ReactSimplyCarousel>
//     </div>
//     </div>
//   );
// }

// export default StatementSelect;
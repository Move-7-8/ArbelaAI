// import React from 'react';
// import Link from 'next/link';
// import ReactSimplyCarousel from 'react-simply-carousel';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// function ComparativeSelect({ company, ticker, industry }) {
//   const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);
//   const [activeRightHover, setActiveRightHover] = React.useState(false);
//   const [activeLeftHover, setActiveLeftHover] = React.useState(false);

//   const companyData = {
//     company,
//     ticker,
//     industry
//   };

//   return (
//     <div className="mt-4">
//       <div className="flex items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">
//           Comparative Analysis
//         </h3>
//       </div>
//       <div className="flex items-center justify-center pb-10 pt-5 px-40 carousel-fade-overlay flex-wrap" style={{ position: 'relative' }}>
//         <ReactSimplyCarousel
//           activeSlideIndex={activeSlideIndex}
//           onRequestChange={setActiveSlideIndex}
//           itemsToScroll={1}
//           speed={500}
//           easing="linear"
//           forwardBtnProps={{
//             style: {
//               alignSelf: 'center',
//               background: 'gray',
//               border: 'none',
//               borderRadius: '50%',
//               color: 'white',
//               cursor: 'pointer',
//               fontSize: '20px',
//               height: 30,
//               lineHeight: 1,
//               textAlign: 'center',
//               width: 30,
//               position: 'absolute',
//               right: '100px',  // Adjust this value for positioning
//               paddingLeft: '4px',
//               zIndex: 9, // Add this line
//               background: activeRightHover ? 'gray' : 'darkgray',  // Add this line
//                   },
//             onMouseOver: () => setActiveRightHover(true),
//             onMouseOut: () => setActiveRightHover(false),
//             children: <FaChevronRight className="h-6 w-6" />,
//           }}
//           backwardBtnProps={{
//             style: {
//               alignSelf: 'center',
//               background: 'gray',
//               border: 'none',
//               borderRadius: '50%',
//               color: 'white',
//               cursor: 'pointer',
//               fontSize: '20px',
//               height: 30,
//               lineHeight: 1,
//               textAlign: 'center',
//               width: 30,
//               position: 'absolute',
//               left: '140px',  // Adjust this value for positioning
//               zIndex: 9, // Add this line
//               background: activeLeftHover ? 'gray' : 'darkgray',  // Add this line
      
//             },
//             onMouseOver: () => setActiveLeftHover(true),  // Add this line
//             onMouseOut: () => setActiveLeftHover(false),  // Add this line    
//                   children: <FaChevronLeft className="h-6 w-6" />,
//           }}
//         >
//           {['Competitor Comparison', 'Market Comparison', 'Time Comparison', 'Price Comparison'].map((analysisType, index) => (
//             <div 
//               key={index} 
//               className="d-block px-4" 
//               style={{ 
//                 width: '50%', 
//                 padding: '0 40px',
//                 minWidth: '10px',
//                 transition: 'opacity 0.5s'  
//               }}
//             >
//               <Link
//                 href={{
//                   pathname: `/companies/${companyData.company.toLowerCase().replace(/ /g, '')}/${analysisType.toLowerCase().replace(/ /g, '')}`,
//                   query: { company, ticker, industry, analysis: analysisType },
//                 }}
//               >
//                 <div
//                   className="backdrop-blur-md border border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 group-hover:scale-110"
//                   style={{
//                     background: 'rgba(255, 255, 255, 0.8)',
//                     backgroundImage: 'linear-gradient(45deg, rgba(255,0,150,0.1), rgba(0,219,222,0.1))',
//                     backdropFilter: 'blur(10px)',
//                     height: '297px',
//                     width: '210px',
//                   }}
//                 >
//                   <span className="text-gray-500 mb-2">{analysisType}</span>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </ReactSimplyCarousel>
//       </div>
//     </div>
//   );
// }

// export default ComparativeSelect;

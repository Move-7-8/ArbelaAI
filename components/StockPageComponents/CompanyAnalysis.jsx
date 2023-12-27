// import { useState, useRef, useEffect } from 'react';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemButton from '@mui/material/ListItemButton';
// import Tooltip from '@mui/material/Tooltip';
// import IconButton from '@mui/material/IconButton';
// import InfoIcon from '@mui/icons-material/Info';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import { CompanyDocumentTypes } from '../../constants'; // Import your categoryMap
// import CloseIcon from '@mui/icons-material/Close';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import Assistant  from '@components/Assistant';

// const CompanyAnalysis = () => {
//   const [selectedDocuments, setSelectedDocuments] = useState([]);
//   const [expanded, setExpanded] = useState(false); 
//   const accordionRefs = useRef({});
//   const searchParams = useSearchParams();
//   const company = searchParams.get('companyName');
//   console.log(`COMPANY NAME IN COMPANYANALYSIS IS:${company} `)
  
//   const stringifiedSelectedDocuments = JSON.stringify(selectedDocuments, null, 2)
//   console.log(`SELECTED DOCUMENTS IN COMPANYANALYSIS IS:${stringifiedSelectedDocuments} `)

//   const handleDocumentSelect = (document) => {
//     console.log(`Document Selected: Name - ${document.name}, PDF Link - ${document.pdfLink}`);

//     if (!selectedDocuments.some(doc => doc.name === document.name)) {
//       setSelectedDocuments(prevState => [...prevState, document]);
//     }
//   };

//   const handleDocumentRemove = (documentToRemove) => {
//     setSelectedDocuments(prevDocs => prevDocs.filter(doc => doc.name !== documentToRemove.name));
//   };

//   const handleChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   const isAnalysisDisabled = selectedDocuments.length === 0;

//   const linkPath = {
//     pathname: `/companies/${company.toLowerCase().replace(/\+/g, ' ').replace(/ /g, '')}/model`,
//     query: {
//       companyName: company.replace(/\+/g, ' '),
//       selectedDocuments: encodeURIComponent(JSON.stringify(selectedDocuments)) // Serialize and encode
//     }
//   };
  
//   return (
//     <div className="p-8 rounded-lg shadow-md company_analysis flex-grow">
//       <div className="flex space-x-4 h-full">
//         <section className="flex-1 p-4 h-full company_analysis_cards flex flex-col">
//           <div className="border p-4 rounded-md h-20 flex items-center justify-center">
//             <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold">
//               Select Datta Points
//               <Tooltip title="Select the data points you want to train the AI model on. 
//               Free plan members get 1 data point. Pro plan members can choose up to 5.">
//                 <IconButton size="small" aria-label="info about select data types">
//                   <InfoIcon fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             </h3>
//           </div>
//           <div className="flex-1 flex flex-col items-center mt-4">
//           {Object.keys(CompanyDocumentTypes).map((docType, index) => (
//             <Accordion 
//               ref={(el) => accordionRefs.current[docType] = el} 
//               className="company_analysis_items" 
//               onChange={handleChange(docType)} 
//               expanded={expanded === docType} 
//               key={index} 
//               style={{ width: '100%', boxShadow: 'none' }}>
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', width: '100%' }}>
//                 <ListItemText primary={docType} />
//               </AccordionSummary>
//               <AccordionDetails style={{ padding: '0', width: '100%' }}>
//                 <List component="div" disablePadding style={{ width: '100%' }}>
//                   {CompanyDocumentTypes[docType].map((doc, docIndex) => (
//                     <ListItemButton key={docIndex} onClick={() => handleDocumentSelect(doc)} style={{ width: '100%' }}>
//                       <ListItemText primary={doc.name} />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               </AccordionDetails>
//             </Accordion>
//             ))}
//           </div>
//         </section>

//       <section className={`flex-1 p-4 h-full company_analysis_cards flex flex-col ${isAnalysisDisabled ? 'disabled' : ''}`}>
//           <div className="border p-4 rounded-md h-20 flex items-center justify-center selected_data">
//             <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold">Selected Data</h3>
//           </div>
//           <div className="flex-1 flex flex-col items-center mt-4">
//           <List component="nav">
//           {selectedDocuments.map((doc, index) => (
//             <ListItem 
//               button 
//               key={index} 
//               style={{ 
//                 border: '1px solid rgba(0, 0, 0, 0.1)', 
//                 borderRadius: '4px', 
//                 marginBottom: '2px', 
//                 padding: '8px', 
//               }}
//               >
//               <ListItemText primary={doc.name} />
//               <IconButton edge="end" aria-label="delete" onClick={() => handleDocumentRemove(doc)}>
//                 <CloseIcon />
//               </IconButton>
//             </ListItem>
//           ))}
//         </List>
//           </div>
//           {/* <Assistant companyName={company} selectedDocuments={stringifiedSelectedDocuments} /> */}
//           <div className=" p-2 rounded mt-4 w-full text-center">
//             <Link href={linkPath} className="analyse_button">
//               Train Model
//             </Link>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }

// export default CompanyAnalysis; 
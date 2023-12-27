'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import PdfReader from '@components/PdfReader';
import ChatBox from '@components/ChatBox';
import Assistant from '@components/Assistant';
import React, { useState } from 'react'; // Import useState from React
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const Page = () => {
    const searchParams = useSearchParams();
    const pdfUrl = "https://clients3.weblink.com.au/pdf/DCC/02691040.pdf";
    const [showPdfReader, setShowPdfReader] = useState(false);

  // Check if the router is ready before accessing the query parameters
    const company = searchParams.get('companyName');
    const ticker = searchParams.get('ticker');
    const industry = searchParams.get('industry');
    const quarter = searchParams.get('quarter');
    const selectedDocumentsStr = searchParams.get('selectedDocuments');
//   const selectedDocuments = JSON.parse(selectedDocumentsStr || "[]");
    const selectedDocuments = selectedDocumentsStr ? JSON.parse(decodeURIComponent(selectedDocumentsStr)) : [];
//   console.log(`SELECTED DOCUMENTS IN MODEL PAGE: ${selectedDocuments}`)
    const toggleComponent = () => {
        setShowPdfReader(!showPdfReader);
    };

  return (
    <div className="company_page flex flex-col h-screen">
        {/* <div className="company_content flex flex-col items-center w-full bg-opacity-60 backdrop-blur-md overflow-y-auto">
            <div className="flex items-center justify-center w-full h-min bg-opacity-60 backdrop-blur-md  p-4  rounded-md flex-shrink-0"> */}
                <div className="text-black-100 flex flex-wrap items-center justify-center">
                    {company && (
                        <a href="#" className="mr-4" style={{ height: '30px' }}>
                            <h5 className="text-lg font-semibold tracking-tight text-gray-900 capitalize">
                                {company.replace(/\+/g, ' ')}
                            </h5>
                        </a>
                    )}
                                <div className="toggle-switch">
                        <FormControlLabel
                            control={
                            <Switch
                                checked={showPdfReader}
                                onChange={toggleComponent}
                                name="showPdfReader"
                            />
                            }
                            label={showPdfReader ? 'Show Assistant' : 'Show PDF Reader'}
                        />
                        </div>

                    {/* {ticker && (
                        <div className="flex items-center justify-center mr-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 rounded capitalize">
                                {ticker}:ASX
                            </span>
                        </div>
                    )}
                    {industry && (
                        <div className="flex items-center justify-center mr-4" style={{ height: '25px' }}>
                        <span className="text-sm text-gray-900 capitalize">
                                {industry.replace(/%2C/g, ', ').replace(/\+/g, ' ')}
                            </span>
                        </div>
                    )}
                    {quarter && (
                        <div className="flex items-center justify-center" style={{ height: '25px' }}>
                            <span className="text-sm text-gray-900 capitalize">
                        {" "}{quarter.replace(/%2C/g, ', ').replace(/\+/g, ' ')}
                            </span>
                        </div>
                    )} */}
                {/* </div>
            </div> */}
        </div>
        <div className="h-full ">
            {/* <div className={`w-full ${showPdfReader ? 'block' : 'hidden lg:hidden'} lg:w-1/2 xl:w-1/3 h-[40vh] lg:h-[80vh] bg-opacity-60 backdrop-blur-md border border-gray-300 p-4 rounded-md overflow-y-auto`}> */}
            <div className={`h-[800px] w-full  ${showPdfReader ? 'block' : 'hidden lg:hidden'}  bg-opacity-60 backdrop-blur-md border border-gray-300 p-4 rounded-md overflow-y: auto; `}>
                <PdfReader pdfUrl={pdfUrl} selectedDocuments={selectedDocuments} />
            </div>
            {/* <div className={`w-full ${showPdfReader ? 'hidden lg:hidden' : 'block'} lg:w-1/2 xl:w-1/3 h-[40vh] lg:h-[80vh] bg-opacity-60 backdrop-blur-md border border-gray-300 p-4 rounded-md overflow-y-auto`}> */}
            <div className={`h-[800px] w-full ${showPdfReader ? 'hidden lg:hidden' : 'block'} ] bg-opacity-60 backdrop-blur-md border border-gray-300 p-4 rounded-md overflow-y: auto; `}>
                <Assistant companyName={company} selectedDocuments={selectedDocuments}/>
            </div>
        </div>
     </div>
    );
};

export default Page;
